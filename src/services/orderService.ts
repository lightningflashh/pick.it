import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Order } from '~/entities/Order'
import { OrderItem } from '~/entities/OrderItem'
import { OrderCoupon } from '~/entities/OrderCoupon'
import { Coupon } from '~/entities/Coupon'
import { User } from '~/entities/User'
import { ProductVariant } from '~/entities/ProductVariant'
import { OrderStatusType } from '~/entities/orderStatus.enum'
import { PaymentStatusType } from '~/entities/paymentStatus.enum'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { DiscountType } from '~/entities/discountType.enum'
import { AppDataSource } from '~/config/data-source'
import { CartItem } from '~/entities/CartItem'
import { Cart } from '~/entities/Cart'
import { env } from '~/config/environment'
import { CreateOrderDto } from '~/dto/CreateOrderDto'

const getDataSource = () => GET_POSTGRESQL_DB()

const orderRepo = () => getDataSource().getRepository(Order)


const create = async (userId: string, data: CreateOrderDto) => {
  return await AppDataSource.transaction(async (manager) => {
    // 1. Check user
    const user = await manager.findOne(User, {
      where: { user_id: userId }
    })

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'USER_NOT_FOUND')
    }

    // 2. Xử lý items + trừ stock
    let totalPrice = 0
    const orderItemsData: any[] = []
    const variantsToUpdate: ProductVariant[] = []

    for (const item of data.items) {
      if (item.quantity <= 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'INVALID_QUANTITY')
      }

      const variant = await manager.findOne(ProductVariant, {
        where: { variant_id: item.variant_id },
        lock: { mode: 'pessimistic_write' }
      })

      if (!variant) {
        throw new ApiError(StatusCodes.NOT_FOUND, `VARIANT_NOT_FOUND: ${item.variant_id}`)
      }

      const variantWithRelations = await manager.findOne(ProductVariant, {
        where: { variant_id: item.variant_id },
        relations: ['size', 'color']
      })

      if (variant.stock < item.quantity) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `OUT_OF_STOCK: ${item.variant_id}`)
      }

      // trừ stock
      variant.stock -= item.quantity
      variantsToUpdate.push(variant)

      totalPrice += variant.price * item.quantity

      orderItemsData.push({
        variant,
        quantity: item.quantity,
        price: variant.price,
        product_name: item.product_name,
        size_name: variantWithRelations?.size?.name,
        color_name: variantWithRelations?.color?.name
      })
    }

    // 3. Xử lý coupon
    let discountAmount = 0
    const orderCouponsData: any[] = []

    if (data.coupon_codes?.length) {
      for (const code of data.coupon_codes) {
        const coupon = await manager.findOne(Coupon, {
          where: { code },
          lock: { mode: 'pessimistic_write' }
        })

        if (!coupon) {
          throw new ApiError(StatusCodes.NOT_FOUND, `COUPON_NOT_FOUND: ${code}`)
        }

        const now = new Date()

        if (now < coupon.start_date || now > coupon.end_date) {
          throw new ApiError(StatusCodes.BAD_REQUEST, `COUPON_EXPIRED: ${code}`)
        }

        if (coupon.used_count >= coupon.usage_limit) {
          throw new ApiError(StatusCodes.BAD_REQUEST, `COUPON_USAGE_LIMIT_EXCEEDED: ${code}`)
        }

        if (coupon.min_order_value && totalPrice < coupon.min_order_value) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'ORDER_AMOUNT_BELOW_MINIMUM')
        }

        // eslint-disable-next-line no-useless-assignment
        let couponDiscount = 0

        if (coupon.discount_type === DiscountType.PERCENT) {
          couponDiscount = (totalPrice * (coupon.discount_value || 0)) / 100
          if (coupon.max_discount) {
            couponDiscount = Math.min(couponDiscount, coupon.max_discount)
          }
        } else {
          couponDiscount = coupon.discount_value || 0
        }

        discountAmount += couponDiscount

        orderCouponsData.push({
          coupon,
          discount_amount: couponDiscount
        })
      }
    }

    const finalPrice = Math.max(0, totalPrice - discountAmount)

    // 4. Tạo order
    const order = manager.create(Order, {
      user,
      total_price: totalPrice,
      discount_amount: discountAmount,
      final_price: finalPrice,
      status: OrderStatusType.Pending,
      payment_status: PaymentStatusType.PENDING,
      shipping_address: data.shipping_address,
      note: data.note
    })

    const savedOrder = await manager.save(Order, order)

    // 5. Save items
    const orderItems = orderItemsData.map((item) =>
      manager.create(OrderItem, {
        ...item,
        order: savedOrder
      })
    )

    await manager.save(OrderItem, orderItems)

    // 6. Save coupons
    const orderCoupons = orderCouponsData.map((c) =>
      manager.create(OrderCoupon, {
        ...c,
        order: savedOrder
      })
    )

    await manager.save(OrderCoupon, orderCoupons)

    // 7. Update stock (batch save)
    await manager.save(ProductVariant, variantsToUpdate)

    // 8. Update coupon usage
    for (const c of orderCoupons) {
      c.coupon.used_count += 1
      await manager.save(Coupon, c.coupon)
    }

    // 9. Clear cart items

    const cart = await manager.findOne(Cart, {
      where: { user: { user_id: userId } }
    })

    if (cart) {
      const variantIds = data.items.map((i: any) => i.variant_id)

      await manager
        .createQueryBuilder()
        .delete()
        .from(CartItem)
        .where('cart_id = :cartId', { cartId: cart.cart_id })
        .andWhere('variant_id IN (:...variantIds)', { variantIds })
        .execute()

    }

    const isDev = env.BUILD_MODE === 'dev'

    return isDev
      ? savedOrder
      : { message: 'create successful' }
  })
}

const findAll = async (params: any) => {
  const { page = 1, limit = 10, status, payment_status, user_id } = params
  const skip = (page - 1) * limit

  const where: any = {}

  if (status) {
    where.status = status
  }

  if (payment_status) {
    where.payment_status = payment_status
  }

  if (user_id) {
    where.user = { user_id }
  }

  const [data, total] = await orderRepo().findAndCount({
    where,
    skip,
    take: limit,
    relations: ['user', 'items', 'coupons', 'coupons.coupon'],
    order: {
      created_at: 'DESC'
    }
  })

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

const findById = async (orderId: string) => {
  const order = await orderRepo().findOne({
    where: { order_id: orderId },
    relations: ['user', 'items', 'items.variant', 'coupons', 'coupons.coupon']
  })

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'ORDER_NOT_FOUND')
  }

  return order
}

const findByUserId = async (userId: string, params: any = {}) => {
  const { page = 1, limit = 10 } = params
  const skip = (page - 1) * limit

  const [data, total] = await orderRepo().findAndCount({
    where: { user: { user_id: userId } },
    skip,
    take: limit,
    relations: ['items', 'items.variant', 'coupons', 'coupons.coupon'],
    order: {
      created_at: 'DESC'
    }
  })

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

const update = async (data: any) => {
  const order = await findById(data.order_id)

  if (data.status) {
    order.status = data.status
  }

  if (data.payment_status) {
    order.payment_status = data.payment_status
  }

  if (data.shipping_address) {
    order.shipping_address = data.shipping_address
  }

  if (data.note !== undefined) {
    order.note = data.note
  }

  return await orderRepo().save(order)
}

const remove = async (orderId: string) => {
  const order = await findById(orderId)
  return await orderRepo().remove(order)
}

export const orderService = {
  create,
  findAll,
  findById,
  findByUserId,
  update,
  remove
}

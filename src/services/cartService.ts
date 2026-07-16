import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Cart } from '~/entities/Cart'
import { CartItem } from '~/entities/CartItem'
import { ProductVariant } from '~/entities/ProductVariant'
import { User } from '~/entities/User'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getDataSource = () => GET_POSTGRESQL_DB()

const cartRepo = () => getDataSource().getRepository(Cart)
const cartItemRepo = () => getDataSource().getRepository(CartItem)
const variantRepo = () => getDataSource().getRepository(ProductVariant)
const userRepo = () => getDataSource().getRepository(User)

const getOrCreateCartByUserId = async (userId: string) => {
  const user = await userRepo().findOne({
    where: { user_id: userId },
    relations: {
      cart: {
        items: {
          variant: {
            product: true,
            color: true,
            size: true
          }
        }
      }
    }
  })

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  let cart = user.cart
  if (!cart) {
    cart = cartRepo().create({ user })
    cart = await cartRepo().save(cart)
  }

  const allItems = cart.items.map((item) => ({
    cart_item_id: item.cart_item_id,
    quantity: item.quantity,
    variant_id: item.variant.variant_id,
    product_name: item.variant.product.name,
    price: item.variant.price,
    size: item.variant.size?.name,
    color: item.variant.color?.name
  }))

  const uniqueVariants = new Set(allItems.map((item) => item.variant_id)).size
  const total = allItems.length

  return {
    cart_id: cart.cart_id,
    items: allItems,
    meta: {
      total,
      uniqueVariants
    }
  }
}

const getMyCart = async (userId: string, page: number = 1, pageSize: number = 10) => {
  const cart = await cartRepo().findOne({
    where: { user: { user_id: userId } },
    relations: {
      items: {
        variant: {
          product: true,
          color: true,
          size: true
        }
      }
    },
    order: {
      items: {
        created_at: 'DESC'
      }
    }
  })

  if (!cart) {
    return {
      cart_id: null,
      items: [],
      meta: {
        total: 0,
        uniqueVariants: 0,
        page: 1,
        pageSize,
        totalPages: 0
      }
    }
  }

  const allItems = cart.items.map((item) => ({
    cart_item_id: item.cart_item_id,
    quantity: item.quantity,
    variant_id: item.variant.variant_id,
    product_name: item.variant.product.name,
    price: item.variant.price,
    size: item.variant.size?.name,
    color: item.variant.color?.name
  }))

  const uniqueVariants = new Set(allItems.map((item) => item.variant_id)).size
  const total = allItems.length
  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedItems = allItems.slice(startIndex, startIndex + pageSize)

  return {
    cart_id: cart.cart_id,
    items: paginatedItems,
    meta: {
      total,
      uniqueVariants,
      page,
      pageSize,
      totalPages
    }
  }
}

const addProductToCart = async (userId: string, data: { variant_id: string; quantity: number }) => {
  const quantity = Number(data.quantity)

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Quantity must be at least 1')
  }

  const variant = await variantRepo().findOne({
    where: { variant_id: data.variant_id },
    relations: {
      product: true,
      color: true,
      size: true
    }
  })

  if (!variant) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product variant not found')
  }

  const cart = await getOrCreateCartByUserId(userId)

  const existingItem = await cartItemRepo().findOne({
    where: {
      cart: { cart_id: cart.cart_id },
      variant: { variant_id: variant.variant_id }
    },
    relations: {
      cart: true,
      variant: true
    }
  })

  const nextQuantity = (existingItem?.quantity || 0) + quantity

  if (nextQuantity > variant.stock) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Quantity exceeds available stock')
  }

  await cartItemRepo().save(
    cartItemRepo().create({
      ...(existingItem || {}),
      cart: { cart_id: cart.cart_id },
      variant,
      quantity: nextQuantity,
      price_at_time: Number(variant.price)
    })
  )

  return getMyCart(userId)
}

const removeProductFromCart = async (userId: string, variantId: string) => {
  const cartData = await getOrCreateCartByUserId(userId)

  const item = await cartItemRepo().findOne({
    where: {
      cart: { cart_id: cartData.cart_id },
      variant: { variant_id: variantId }
    },
    relations: {
      cart: true,
      variant: true
    }
  })

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Cart item not found')
  }

  await cartItemRepo().remove(item)

  return getMyCart(userId)
}

export const cartService = {
  getOrCreateCartByUserId,
  getMyCart,
  addProductToCart,
  removeProductFromCart
}

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
      cart: true
    }
  })

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  if (user.cart) {
    return user.cart
  }

  const cart = cartRepo().create({
    user
  })

  return await cartRepo().save(cart)
}

const getMyCart = async (userId: string) => {
  const cart = await cartRepo().findOne({
    select: {
      cart_id: true,
      items: {
        quantity: true,
        price_at_time: true,
        created_at: true,
        variant: {
          variant_id: true,
          product: {
            product_id: true,
            name: true,
            short_description: true
          },
          color: {
            name: true
          },
          size: {
            name: true
          }
        }
      }
    },
    where: { user: { user_id: userId } },
    relations: {
      user: false,
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
    const createdCart = await getOrCreateCartByUserId(userId)

    return {
      ...createdCart,
      items: []
    }
  }

  return cart
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
      cart,
      variant,
      quantity: nextQuantity,
      price_at_time: Number(variant.price)
    })
  )

  return
}

const removeProductFromCart = async (userId: string, variantId: string) => {
  const cart = await getOrCreateCartByUserId(userId)

  const item = await cartItemRepo().findOne({
    where: {
      cart: { cart_id: cart.cart_id },
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

  return true
}

export const cartService = {
  getOrCreateCartByUserId,
  getMyCart,
  addProductToCart,
  removeProductFromCart
}

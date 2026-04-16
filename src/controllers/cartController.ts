import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cartService'

const getUserId = (req: Request) => (req as any).jwtDecoded?.user_id as string

const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req)

    const result = await cartService.getMyCart(userId)

    return res.status(StatusCodes.OK).json({
      message: 'Get cart success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req)
    await cartService.addProductToCart(userId, req.body)

    return res.status(StatusCodes.OK).json({
      message: 'Add product to cart success'
    })
  } catch (error) {
    next(error)
  }
}

const removeProductFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req)
    await cartService.removeProductFromCart(userId, req.params.variant_id as string)

    return res.status(StatusCodes.OK).json({
      message: 'Remove product from cart success'
    })
  } catch (error) {
    next(error)
  }
}

export const cartController = {
  getMyCart,
  addProductToCart,
  removeProductFromCart
}

import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'
import { paymentService } from '~/services/paymentService'
import ApiError from '~/utils/ApiError'

const getUserId = (req: Request) => (req as any).jwtDecoded?.user_id as string

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req)

    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated')
    }

    const result = await orderService.create(userId, req.body)

    return res.status(StatusCodes.CREATED).json({
      message: 'Create order success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, status, payment_status, user_id } = req.query

    const result = await orderService.findAll({
      page: Number(page) > 0 ? Number(page) : 1,
      limit: Number(limit) > 0 ? Number(limit) : 10,
      status: typeof status === 'string' ? status : undefined,
      payment_status: typeof payment_status === 'string' ? payment_status : undefined,
      user_id: typeof user_id === 'string' ? user_id : undefined
    })

    return res.json({
      message: 'Get orders success',
      ...result
    })
  } catch (error) {
    next(error)
  }
}

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderService.findById(req.params.id as string)

    return res.json({
      message: 'Get order success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const findByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req)

    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated')
    }

    const { page, limit } = req.query

    const result = await orderService.findByUserId(userId, {
      page: Number(page) > 0 ? Number(page) : 1,
      limit: Number(limit) > 0 ? Number(limit) : 10
    })

    return res.json({
      message: 'Get user orders success',
      ...result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderService.update(req.body)

    return res.json({
      message: 'Update order success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.remove(req.params.id as string)

    return res.json({
      message: 'Delete order success'
    })
  } catch (error) {
    next(error)
  }
}

const createPaymentUrl = (req: Request, res: Response, next: NextFunction) => {
  try {
    return paymentService.createPaymentUrl(req, res)
  } catch (error) {
    next(error)
  }
}

const handleVnpayReturn = (req: Request, res: Response, next: NextFunction) => {
  try {
    return paymentService.handleVnpayReturn(req, res)
  } catch (error) {
    next(error)
  }
}

const handleVnpayIpn = (req: Request, res: Response, next: NextFunction) => {
  try {
    return paymentService.handleVnpayIpn(req, res)
  } catch (error) {
    next(error)
  }
}

const queryDr = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return await paymentService.queryDr(req, res)
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  createNew,
  findAll,
  findById,
  findByUserId,
  update,
  remove,
  createPaymentUrl,
  handleVnpayReturn,
  handleVnpayIpn,
  queryDr
}

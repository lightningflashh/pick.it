import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { couponService } from '~/services/couponService'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await couponService.create(req.body)

    return res.status(StatusCodes.CREATED).json({
      message: 'Create coupon success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, code, status } = req.query

    const result = await couponService.findAll({
      page: Number(page) > 0 ? Number(page) : 1,
      limit: Number(limit) > 0 ? Number(limit) : 10,
      code: typeof code === 'string' ? code : undefined,
      status: typeof status === 'string' ? status : undefined
    })

    return res.json({
      message: 'Get coupons success',
      ...result
    })
  } catch (error) {
    next(error)
  }
}

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await couponService.findById(Number(req.params.id))

    return res.json({
      message: 'Get coupon success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const findByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await couponService.findByCode(req.params.code as string)

    return res.json({
      message: 'Get coupon success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await couponService.update(req.body)

    return res.json({
      message: 'Update coupon success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await couponService.remove(Number(req.params.id))

    return res.json({
      message: 'Delete coupon success'
    })
  } catch (error) {
    next(error)
  }
}

export const couponController = {
  createNew,
  findAll,
  findById,
  findByCode,
  update,
  remove
}

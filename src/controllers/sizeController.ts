import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { sizeService } from '~/services/sizeService'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await sizeService.create(req.body)

    return res.status(StatusCodes.CREATED).json({
      message: 'Size created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sizeIdFromParams = Number(req.params.id)

    const payload = {
      ...req.body,
      size_id: Number.isInteger(sizeIdFromParams) && sizeIdFromParams > 0 ? sizeIdFromParams : req.body.size_id
    }

    const result = await sizeService.update(payload)

    return res.status(StatusCodes.OK).json({
      message: 'Size updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sizeId = Number(req.params.id)

    const result = await sizeService.remove(sizeId)

    return res.status(StatusCodes.OK).json({
      message: 'Size deleted successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await sizeService.findAll()

    return res.status(StatusCodes.OK).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const sizeController = {
  createNew,
  update,
  remove,
  findAll
}

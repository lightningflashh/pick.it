import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { colorService } from '~/services/colorService'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await colorService.create(req.body)

    return res.status(StatusCodes.CREATED).json({
      message: 'Color created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const colorIdFromParams = Number(req.params.id)

    const payload = {
      ...req.body,
      color_id: Number.isInteger(colorIdFromParams) && colorIdFromParams > 0 ? colorIdFromParams : req.body.color_id
    }

    const result = await colorService.update(payload)

    return res.status(StatusCodes.OK).json({
      message: 'Color updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const colorId = Number(req.params.id)

    const result = await colorService.remove(colorId)

    return res.status(StatusCodes.OK).json({
      message: 'Color deleted successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await colorService.findAll()

    return res.status(StatusCodes.OK).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const colorController = {
  createNew,
  update,
  remove,
  findAll
}

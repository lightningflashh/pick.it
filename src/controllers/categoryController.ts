import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { categoryService } from '~/services/categoryService'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.create(req.body)

    res.status(StatusCodes.CREATED).json({
      message: 'Category created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.findAll()

    res.status(StatusCodes.OK).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.findById(req.params.id as string)

    res.status(StatusCodes.OK).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.save(req.params.id as string, req.body)

    res.status(StatusCodes.OK).json({
      message: 'Updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.remove(req.params.id as string)

    res.status(StatusCodes.OK).json({
      message: 'Deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const categoryController = {
  createNew,
  getAll,
  getById,
  update,
  remove
}

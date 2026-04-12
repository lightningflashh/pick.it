import { NextFunction, Request, Response } from 'express'
import { productService } from '~/services/productService'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.create(req.body)

    return res.status(201).json({
      message: 'Create product success',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, name, status, slug, brand, sortBy, order } = req.query

    const result = await productService.findAll({
      page: Number(page) > 0 ? Number(page) : 1,
      limit: Number(limit) > 0 ? Number(limit) : 10,
      name: typeof name === 'string' ? name : undefined,
      status: typeof status === 'string' ? status === 'true' : undefined,
      slug: typeof slug === 'string' ? slug : undefined,
      brand: typeof brand === 'string' ? brand : undefined,
      sortBy: sortBy === 'name' || sortBy === 'created_at' ? sortBy : 'created_at',
      order: order === 'ASC' || order === 'DESC' ? order : 'DESC'
    })

    return res.json({
      message: 'Get products success',
      ...result
    })
  } catch (error) {
    next(error)
  }
}

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.findById(req.params.id as string)

    return res.json({
      message: 'Get product success',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.update(req.body)

    return res.json({
      message: 'Update product success',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.remove(req.params.id as string)

    return res.json({
      message: 'Delete product success'
    })
  } catch (error: any) {
    next(error)
  }
}

export const productController = {
  createNew,
  findAll,
  findById,
  update,
  remove
}

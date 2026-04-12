import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { productVariantService } from '~/services/productVariantService'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productVariantService.create(req.body)

    return res.status(StatusCodes.CREATED).json({
      message: 'Create product variant success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, product_id, color_id, size_id, minStock, maxStock, minPrice, maxPrice, sortBy, order } =
      req.query

    const result = await productVariantService.findAll({
      page: Number(page) > 0 ? Number(page) : 1,
      limit: Number(limit) > 0 ? Number(limit) : 10,
      product_id: typeof product_id === 'string' ? product_id : undefined,
      color_id: typeof color_id === 'string' && Number(color_id) > 0 ? Number(color_id) : undefined,
      size_id: typeof size_id === 'string' && Number(size_id) > 0 ? Number(size_id) : undefined,
      minStock: typeof minStock === 'string' && Number(minStock) >= 0 ? Number(minStock) : undefined,
      maxStock: typeof maxStock === 'string' && Number(maxStock) >= 0 ? Number(maxStock) : undefined,
      minPrice: typeof minPrice === 'string' && Number(minPrice) >= 0 ? Number(minPrice) : undefined,
      maxPrice: typeof maxPrice === 'string' && Number(maxPrice) >= 0 ? Number(maxPrice) : undefined,
      sortBy: sortBy === 'created_at' || sortBy === 'stock' || sortBy === 'price' ? sortBy : 'created_at',
      order: order === 'ASC' || order === 'DESC' ? order : 'DESC'
    })

    return res.status(StatusCodes.OK).json({
      message: 'Get product variants success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productVariantService.findById(req.params.id as string)

    return res.status(StatusCodes.OK).json({
      message: 'Get product variant success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = {
      ...req.body,
      variant_id: req.params.id || req.body.variant_id
    }

    const result = await productVariantService.update(payload)

    return res.status(StatusCodes.OK).json({
      message: 'Update product variant success',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productVariantService.remove(req.params.id as string)

    return res.status(StatusCodes.OK).json({
      message: 'Delete product variant success'
    })
  } catch (error) {
    next(error)
  }
}

export const productVariantController = {
  createNew,
  findAll,
  findById,
  update,
  remove
}

import express from 'express'
import { productController } from '~/controllers/productController'
import { CreateProductDto } from '~/dto/CreateProductDto'
import { UpdateProductDto } from '~/dto/UpdateProductDto'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { validateDto } from '~/validation/ValidateDto'

const Router = express.Router()

Router.post('/', validateDto(CreateProductDto), productController.createNew)
Router.get('/', productController.findAll)
Router.get('/:id', productController.findById)
Router.put('/', validateDto(UpdateProductDto), productController.update)
Router.delete('/:id', productController.remove)

export const productRoute = Router

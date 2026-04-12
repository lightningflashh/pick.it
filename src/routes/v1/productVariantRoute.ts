import express from 'express'
import { productVariantController } from '~/controllers/productVariantController'
import { CreateProductVariantDto } from '~/dto/CreateProductVariantDto'
import { UpdateProductVariantDto } from '~/dto/UpdateProductVariantDto'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { validateDto } from '~/validation/ValidateDto'

const Router = express.Router()

Router.post('/', authMiddleware.isAuthorized, validateDto(CreateProductVariantDto), productVariantController.createNew)
Router.get('/', productVariantController.findAll)
Router.get('/:id', productVariantController.findById)
Router.put('/:id', authMiddleware.isAuthorized, validateDto(UpdateProductVariantDto), productVariantController.update)
Router.delete('/:id', authMiddleware.isAuthorized, productVariantController.remove)

export const productVariantRoute = Router

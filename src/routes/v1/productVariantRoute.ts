import express from 'express'
import { productVariantController } from '~/controllers/productVariantController'
import { CreateProductVariantDto } from '~/dto/CreateProductVariantDto'
import { UpdateProductVariantDto } from '~/dto/UpdateProductVariantDto'
import { RoleType } from '~/entities/role.enum'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'
import { validateDto } from '~/validation/ValidateDto'

const Router = express.Router()

Router.post(
  '/',
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission([RoleType.ADMIN]),
  validateDto(CreateProductVariantDto),
  productVariantController.createNew
)
Router.get('/', productVariantController.findAll)
Router.get('/:id', productVariantController.findById)
Router.put(
  '/:id',
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission([RoleType.ADMIN]),
  validateDto(UpdateProductVariantDto),
  productVariantController.update
)
Router.delete(
  '/:id',
  authMiddleware.isAuthorized,
  rbacMiddleware.isValidPermission([RoleType.ADMIN]),
  productVariantController.remove
)

export const productVariantRoute = Router

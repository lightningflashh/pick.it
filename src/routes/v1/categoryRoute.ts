import express from 'express'
import { categoryController } from '~/controllers/categoryController'
import { RoleType } from '~/entities/role.enum'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'
const Router = express.Router()

Router.post('/', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.ADMIN]), categoryController.createNew)
Router.get('/', categoryController.getAll)
Router.get('/:id', categoryController.getById)
Router.put('/:id', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.ADMIN]), categoryController.update)
Router.delete('/:id', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.ADMIN]), categoryController.remove)

export const categoryRoute = Router

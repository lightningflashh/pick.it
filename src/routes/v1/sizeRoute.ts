import express from 'express'
import { sizeController } from '~/controllers/sizeController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.post('/', authMiddleware.isAuthorized, sizeController.createNew)
Router.get('/', sizeController.findAll)
Router.put('/:id', authMiddleware.isAuthorized, sizeController.update)
Router.delete('/:id', authMiddleware.isAuthorized, sizeController.remove)

export const sizeRoute = Router

import express from 'express'
import { colorController } from '~/controllers/colorController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.post('/', authMiddleware.isAuthorized, colorController.createNew)
Router.get('/', colorController.findAll)
Router.put('/:id', authMiddleware.isAuthorized, colorController.update)
Router.delete('/:id', authMiddleware.isAuthorized, colorController.remove)

export const colorRoute = Router

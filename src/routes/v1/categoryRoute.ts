import express from 'express'
import { categoryController } from '~/controllers/categoryController'
const Router = express.Router()

Router.post('/', categoryController.createNew)
Router.get('/', categoryController.getAll)
Router.get('/:id', categoryController.getById)
Router.put('/:id', categoryController.update)
Router.delete('/:id', categoryController.remove)

export const categoryRoute = Router

import express from 'express'
import { productRoute } from '~/routes/v1/productRoute'
import { categoryRoute } from './categoryRoute'

const Router = express.Router()

Router.use('/products', productRoute)
Router.use('/categories', categoryRoute)

export const APIs_V1 = Router

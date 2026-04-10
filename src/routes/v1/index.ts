import express from 'express'
import { productRoute } from '~/routes/v1/productRoute'

const Router = express.Router()

Router.use('/products', productRoute)

export const APIs_V1 = Router

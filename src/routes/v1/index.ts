import express from 'express'
import { productRoute } from '~/routes/v1/productRoute'
import { categoryRoute } from '~/routes/v1/categoryRoute'
import { userRoute } from '~/routes/v1/userRoute'

const Router = express.Router()

Router.use('/users', userRoute)

Router.use('/products', productRoute)
Router.use('/categories', categoryRoute)

export const APIs_V1 = Router

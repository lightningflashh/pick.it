import express from 'express'
import { productRoute } from '~/routes/v1/productRoute'
import { categoryRoute } from '~/routes/v1/categoryRoute'
import { userRoute } from '~/routes/v1/userRoute'
import { colorRoute } from '~/routes/v1/colorRoute'
import { sizeRoute } from '~/routes/v1/sizeRoute'
import { productVariantRoute } from '~/routes/v1/productVariantRoute'

const Router = express.Router()

Router.use('/users', userRoute)

Router.use('/products', productRoute)
Router.use('/categories', categoryRoute)

Router.use('/colors', colorRoute)
Router.use('/sizes', sizeRoute)
Router.use('/variants', productVariantRoute)

export const APIs_V1 = Router

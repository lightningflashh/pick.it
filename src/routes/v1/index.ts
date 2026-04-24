import express from 'express'
import { productRoute } from '~/routes/v1/productRoute'
import { categoryRoute } from '~/routes/v1/categoryRoute'
import { userRoute } from '~/routes/v1/userRoute'
import { colorRoute } from '~/routes/v1/colorRoute'
import { sizeRoute } from '~/routes/v1/sizeRoute'
import { productVariantRoute } from '~/routes/v1/productVariantRoute'
import { cartRoute } from '~/routes/v1/cartRoute'
import { orderRoute } from '~/routes/v1/orderRoute'
import { couponRoute } from '~/routes/v1/couponRoute'

const Router = express.Router()

Router.use('/users', userRoute)

Router.use('/products', productRoute)
Router.use('/categories', categoryRoute)

Router.use('/colors', colorRoute)
Router.use('/sizes', sizeRoute)
Router.use('/variants', productVariantRoute)
Router.use('/carts', cartRoute)

Router.use('/orders', orderRoute)
Router.use('/coupons', couponRoute)

export const APIs_V1 = Router

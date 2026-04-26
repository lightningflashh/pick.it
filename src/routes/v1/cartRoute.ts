import express from 'express'
import { cartController } from '~/controllers/cartController'
import { AddToCartDto } from '~/dto/AddToCartDto'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { validateDto } from '~/validation/ValidateDto'

const Router = express.Router()

Router.get('/me', authMiddleware.isAuthorized, cartController.getMyCart)
Router.post('/add', authMiddleware.isAuthorized, validateDto(AddToCartDto), cartController.addProductToCart)
Router.delete('/item/:variant_id', authMiddleware.isAuthorized, cartController.removeProductFromCart)

export const cartRoute = Router

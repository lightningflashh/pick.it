import express from 'express'
import { cartController } from '~/controllers/cartController'
import { AddToCartDto } from '~/dto/AddToCartDto'
import { RemoveFromCartDto } from '~/dto/RemoveFromCartDto'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { validateDto } from '~/validation/ValidateDto'

const Router = express.Router()

Router.get('/me', authMiddleware.isAuthorized, cartController.getMyCart)
Router.post('/add', authMiddleware.isAuthorized, validateDto(AddToCartDto), cartController.addProductToCart)
Router.delete('/items/:variant_id', authMiddleware.isAuthorized, cartController.removeProductFromCart)

export const cartRoute = Router

import express from 'express'
import { couponController } from '~/controllers/couponController'
import { CreateCouponDto } from '~/dto/CreateCouponDto'
import { UpdateCouponDto } from '~/dto/UpdateCouponDto'
import { validateDto } from '~/validation/ValidateDto'

const Router = express.Router()

// Public routes
Router.get('/', couponController.findAll)
Router.get('/code/:code', couponController.findByCode)
Router.get('/:id', couponController.findById)

// Protected routes (admin only - you may want to add admin middleware)
Router.post('/', validateDto(CreateCouponDto), couponController.createNew)
Router.put('/', validateDto(UpdateCouponDto), couponController.update)
Router.delete('/:id', couponController.remove)

export const couponRoute = Router

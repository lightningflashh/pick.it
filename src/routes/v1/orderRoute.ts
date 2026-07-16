import express from 'express'
import { orderController } from '~/controllers/orderController'
import { CreateOrderDto } from '~/dto/CreateOrderDto'
import { UpdateOrderDto } from '~/dto/UpdateOrderDto'
import { RoleType } from '~/entities/role.enum'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacMiddleware } from '~/middlewares/rbacMiddleware'
import { validateDto } from '~/validation/ValidateDto'

const Router = express.Router()

Router.post('/', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.USER]), validateDto(CreateOrderDto), orderController.createNew)
Router.get('/', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.USER]), orderController.findAll) // Tạm để user có thể xem tất cả đơn hàng của mình
Router.get('/user/orders', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.USER]), orderController.findByUserId)
Router.get('/:id', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.ADMIN]), orderController.findById)

Router.put('/:id', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.USER]), validateDto(UpdateOrderDto), orderController.update)
Router.delete('/:id', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.ADMIN, RoleType.USER]), orderController.remove)

// Payment routes
Router.post('/payment/create-payment-url', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.USER]), orderController.createPaymentUrl)
Router.get('/payment/vnpay-return', orderController.handleVnpayReturn)
Router.post('/payment/vnpay-ipn', orderController.handleVnpayIpn)
Router.post('/payment/query-dr', authMiddleware.isAuthorized, rbacMiddleware.isValidPermission([RoleType.USER]), orderController.queryDr)

export const orderRoute = Router

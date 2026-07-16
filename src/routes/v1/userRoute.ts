import express from 'express'
import { userController } from '~/controllers/userController'
import { CreateUserDto } from '~/dto/CreateUserDto'
import { VerifyAccountDto } from '~/dto/VerifyAccountDto'
import { validateDto } from '~/validation/ValidateDto'

const Router = express.Router()

Router.route('/register').post(validateDto(CreateUserDto), userController.createNew)

Router.route('/login').post(userController.login)

Router.route('/logout').delete(userController.logout)

Router.route('/refresh-token').get(userController.refreshToken)

Router.route('/verify').post(validateDto(VerifyAccountDto), userController.verifyAccount)

export const userRoute = Router

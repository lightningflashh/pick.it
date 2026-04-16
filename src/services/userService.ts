import { StatusCodes } from 'http-status-codes'
import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { User } from '~/entities/User'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { TokenPayload } from '~/types/Auth/tokenPayload'
import { v4 as uuidv4 } from 'uuid'
import { MailerSendProvider } from '~/providers/MailerSendProvider'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { RoleType } from '~/entities/role.enum'
import { pickUser } from '~/utils/formatters'
import { VerifyAccountDto } from '~/dto/VerifyAccountDto'
import { Cart } from '~/entities/Cart'

const getRepo = () => GET_POSTGRESQL_DB().getRepository(User)
const getCartRepo = () => GET_POSTGRESQL_DB().getRepository(Cart)

const createNew = async (reqBody: any) => {
  const repo = getRepo()

  const existingUser = await repo.findOneBy({
    email: reqBody.email
  })

  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
  }

  const newUser = repo.create({
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.password, 10),
    full_name: reqBody.full_name,
    phone: reqBody.phone,
    address: reqBody.address,
    is_active: false,
    role: RoleType.USER,
    verify_token: uuidv4()
  })

  const savedUser = await repo.save(newUser)

  const cartRepo = getCartRepo()
  const cart = cartRepo.create({
    user: savedUser
  })

  await cartRepo.save(cart)

  const getNewUser = await repo.findOneBy({
    user_id: savedUser.user_id
  })

  const verificationUrl = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser?.email}&token=${getNewUser?.verify_token}`
  const customSubject = 'Pick!t: Please verify your account'
  const htmlContent = `
        <h1>Welcome to Pick!t</h1>
        <p>To complete your registration, please verify your account by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Account</a>
      `
  await MailerSendProvider.sendEmail({
    to: getNewUser?.email as string,
    toName: getNewUser?.full_name as string,
    subject: customSubject,
    html: htmlContent
  })

  return pickUser(getNewUser)
}

const verifyAccount = async (reqBody: VerifyAccountDto) => {
  const repo = getRepo()

  const existingUser = await repo.findOneBy({
    email: reqBody.email
  })

  if (!existingUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  if (existingUser.is_active) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account already verified')
  if (reqBody.token !== existingUser.verify_token)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid verification token')

  const updatedUser = await repo.update(existingUser.user_id, {
    is_active: true,
    verify_token: ''
  })

  return pickUser(updatedUser)
}

const login = async (reqBody: any) => {
  const repo = getRepo()

  const user = await repo.findOneBy({
    email: reqBody.email
  })

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  if (!user.is_active) {
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account not active')
  }

  const isMatch = bcrypt.compareSync(reqBody.password, user.password)

  if (!isMatch) {
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid password')
  }

  const payload = {
    user_id: user.user_id,
    email: user.email,
    role: user.role
  }

  const accessToken = JwtProvider.generateToken(
    payload,
    env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
    env.ACCESS_TOKEN_LIFE as string
  )

  const refreshToken = JwtProvider.generateToken(
    payload,
    env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
    env.REFRESH_TOKEN_LIFE as string
  )

  return {
    user_id: user.user_id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    accessToken,
    refreshToken
  }
}

const refreshToken = async (clientRefreshToken: string) => {
  const decoded = (await JwtProvider.verifyToken(
    clientRefreshToken,
    env.REFRESH_TOKEN_SECRET_SIGNATURE as string
  )) as TokenPayload

  const payload = {
    user_id: decoded.user_id,
    email: decoded.email,
    role: decoded.role
  }

  const accessToken = JwtProvider.generateToken(
    payload,
    env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
    env.ACCESS_TOKEN_LIFE as string
  )

  return { accessToken }
}

export const userService = {
  createNew,
  login,
  refreshToken,
  verifyAccount
}

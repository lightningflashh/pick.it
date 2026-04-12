import { StatusCodes } from 'http-status-codes'
import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { User } from '~/entities/User'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { TokenPayload } from '~/types/Auth/tokenPayload'

const getRepo = () => GET_POSTGRESQL_DB().getRepository(User)

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
    is_active: true
  })

  const savedUser = await repo.save(newUser)

  return {
    user_id: savedUser.user_id,
    email: savedUser.email,
    full_name: savedUser.full_name,
    phone: savedUser.phone,
    address: savedUser.address,
    role: savedUser.role
  }
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

  const accessToken = await JwtProvider.generateToken(
    payload,
    env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
    env.ACCESS_TOKEN_LIFE as string
  )

  const refreshToken = await JwtProvider.generateToken(
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

  const accessToken = await JwtProvider.generateToken(
    payload,
    env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
    env.ACCESS_TOKEN_LIFE as string
  )

  return { accessToken }
}

export const userService = {
  createNew,
  login,
  refreshToken
}

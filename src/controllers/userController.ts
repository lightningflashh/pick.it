import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ms from 'ms'
import ApiError from '~/utils/ApiError'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await userService.createNew(req.body)

    return res.status(StatusCodes.CREATED).json({
      message: 'Register success',
      data: createdUser
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.login(req.body)

    res.cookie('accessToken', user.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    return res.status(StatusCodes.OK).json({
      message: 'Login success',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    return res.status(StatusCodes.OK).json({
      message: 'Logged out successfully'
    })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientRefreshToken = req.cookies?.refreshToken

    if (!clientRefreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'No refresh token')
    }

    const result = await userService.refreshToken(clientRefreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    return res.status(StatusCodes.OK).json({
      message: 'Refresh token success',
      data: result
    })
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Invalid refresh token, please login again'))
  }
}

export const userController = {
  createNew,
  login,
  logout,
  refreshToken
}

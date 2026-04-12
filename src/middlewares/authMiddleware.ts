import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req: any, res: any, next: any) => {
  const accessToken = req.cookies?.accessToken

  if (!accessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'No access token provided'))
    return
  }

  try {
    const decoded = JwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE as string)
    req.jwtDecoded = decoded

    next()
  } catch (error: any) {
    // Nếu access token hết hạn (expired) thì trả về mã lỗi GONE (410) để phía client có thể refresh token
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Access token expired'))
      return
    }
    console.log('Error verifying access token:', error)

    // Nếu token không hợp lệ thì trả về mã lỗi UNAUTHORIZED (401)
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid access token'))
  }
}

export const authMiddleware = {
  isAuthorized
}

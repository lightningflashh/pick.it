import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const isValidPermission = (allowedRoles: string[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      const userRole = req.jwtDecoded.role
      console.log('User Role:', userRole)

      if (!userRole || !allowedRoles.includes(userRole)) {
        next(new ApiError(StatusCodes.FORBIDDEN, 'Insufficient permissions'))
        return
      }

      next()
    } catch (error: any) {
      next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error checking permissions'))
    }
  }
}

export const rbacMiddleware = {
  isValidPermission
}
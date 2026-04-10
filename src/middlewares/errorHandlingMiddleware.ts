/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

export const errorHandlingMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // If error doesn't have statusCode property, set it to 500 (Internal Server Error) by default
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Create a responseError object to send back to the client, which includes the status code, message, and stack trace (if in development mode)
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // If error doesn't have a message, use the default ReasonPhrase for the status code
    stack: err.stack
  }

  // Only include the stack trace in development mode for easier debugging, otherwise remove it.
  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Return the responseError to the Front-end
  res.status(responseError.statusCode).json(responseError)
}

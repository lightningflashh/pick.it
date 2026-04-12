import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'

export const validateDto = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body)

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.map((e) => ({
          field: e.property,
          constraints: e.constraints
        }))
      })
    }

    req.body = dto
    next()
  }
}

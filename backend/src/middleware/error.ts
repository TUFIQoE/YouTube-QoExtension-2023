import { CustomError } from '../utils/CustomError'
import { Request, Response, NextFunction } from 'express'

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  if (error instanceof CustomError) {
    next(error)
  } else {
    next(new CustomError(error.message, 500))
  }
}

export const errorResponder = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const body = {
    message: error.message,
    errors: error.errors,
  }
  res.status(error.statusCode || 500).json(body)
}

import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { CustomError } from '../utils/CustomError'

/**
 * Use this middleware to validate the request body in routes
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation error', 400, errors.array()))
  }
  next()
}

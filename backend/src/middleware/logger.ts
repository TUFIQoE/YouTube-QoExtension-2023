import * as winston from 'winston'
import type { Request, Response, NextFunction } from 'express'

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.Console({ level: 'error' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf((info) => {
      return `[${info.level}] ${info.timestamp}  ${info.message}`
    })
  ),
})

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`)

  next()
}

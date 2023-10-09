import * as express from 'express'
import * as cors from 'cors'
import { SERVER_PORT } from './config'
import * as process from 'process'
import * as http from 'http'

import { AppDataSource } from './database'
import { errorHandler } from './middleware/error'
import { errorResponder } from './middleware/error'
import { requestLogger } from './middleware/logger'

import commonRouter from './routes/commonRouter'

export interface App {
  app: express.Application
  server: http.Server
}

export const createApp = async (): Promise<App> => {
  const app = express()

  await AppDataSource.initialize()

  // Cors
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://localhost:8000', 'https://www.youtube.com'],
    })
  )

  // Request body parser
  app.use(express.json())

  // Middlewares
  app.use(requestLogger)

  // Endpoints
  app.use('/', commonRouter)
  // ...
  // ...

  // Global error handling [NOTE - after all endpoints]
  app.use(errorHandler)
  app.use(errorResponder)

  // Start http server
  const port = process.env.NODE_ENV === 'test' ? process.env.SERVER_PORT : SERVER_PORT
  const server = app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })

  return { app, server }
}

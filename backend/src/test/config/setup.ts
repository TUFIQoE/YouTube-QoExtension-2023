import { App } from '../../app'
import { createApp } from '../../app'
import { AppDataSource } from '../../database'

// Setup function
export default async (globalConfig: any, projectConfig: any) => {
  const app: App = await createApp()
  global.app = app.app
  global.server = app.server
}

import { after, before } from 'node:test'
import { createApp } from '../app'
import { Application } from 'express'
import * as http from 'http'
import { App } from '../app'

let app: App

beforeAll(async () => {
  app = await createApp()
})

afterAll(async () => {
  app.server.close()
})

test('Testing jest setup', () => {
  expect(true).toBe(true)
})

import * as process from 'process'
import * as path from 'path'
import { DataSource } from 'typeorm'
import { Experiment } from './entities/Experiment'
import { DebugData } from './entities/DebugData'

import { Assessment } from './entities/Assessment'
import { Event } from './entities/Event'
console.log(__dirname)
export const AppDataSource = new DataSource({
  type: 'sqlite',
  //host: "localhost",
  //port: 5432,
  //username: "test",
  //password: "test",
  database: process.env.NODE_ENV === 'test' ? path.join(__dirname, 'database.test.sqlite') : path.join(__dirname, 'database.sqlite'),
  synchronize: false, // <-- DO NOT USE true IN PRODUCTION
  logging: false,
  entities: [Experiment, DebugData, Assessment, Event], // <-- all entities have to be imported
  subscribers: [],
  migrations: [],
  dropSchema: false, // <-- DO NOT USE true IN PRODUCTION
})

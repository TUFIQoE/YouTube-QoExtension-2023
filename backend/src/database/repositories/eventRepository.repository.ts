import { AppDataSource } from '..'
import { Event } from '../entities/Event'

export const EventRepository = AppDataSource.getRepository(Event)

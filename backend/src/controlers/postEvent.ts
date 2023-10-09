import { Request, Response, NextFunction } from 'express'
import { EventSource } from '../database/entities/Event'
import { ExperimentRepository } from '../database/repositories/experiment.repository'
import { CustomError } from '../utils/CustomError'
import { EventRepository } from '../database/repositories/eventRepository.repository'

export interface PostEventRequestBody {
  experimentID: number
  source: EventSource
  type: string // eg. mousedown, keyup, scroll, drag
  timestamp: string
  location: string

  details: object
}

export const postEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as PostEventRequestBody
    const experiment = await ExperimentRepository.findOne({ where: { id: body.experimentID } })
    if (!experiment) {
      throw new CustomError('Experiment not found', 400)
    }
    // Create event
    const event = EventRepository.create({
      experiment,
      source: body.source,
      timestamp: body.timestamp,
      type: body.type,
      location: body.location,
      details: body.details,
    })
    await EventRepository.save(event)

    res.status(201).json({ msg: 'OK' })
  } catch (err) {
    next(err)
  }
}

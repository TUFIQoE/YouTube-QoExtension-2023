import { Request, Response, NextFunction } from 'express'
import { Experiment, SubjectSex } from '../database/entities/Experiment'
import { ExperimentRepository } from '../database/repositories/experiment.repository'
import { DebugDataRepository } from '../database/repositories/debugData.repository'
import { DebugData } from '../database/entities/DebugData'
import { CustomError } from '../utils/CustomError'

export interface PostDebugDatumRequestBody {
  experimentID: string | null
  videoID: string | null
  sCPN: string | null
  viewport: string | null
  droppedFrames: string | null
  totalFrames: string | null
  currentResolution: string | null
  optimalResolution: string | null
  volume: string | null
  normalizedVolume: string | null
  codecs: string | null
  color: string | null
  connectionSpeed: string | null
  networkActivity: string | null
  bufferHealth: string | null
  mysteryText: string | null
  date: string | null

  sessionID: string | null
  timestamp: string | null
}

export const postDebugDatum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { experimentID, ...data } = req.body as PostDebugDatumRequestBody
    const experiment = await ExperimentRepository.findOne({ where: { id: Number(experimentID) } })
    if (!experiment) {
      throw new CustomError('Experiment does not exist', 400)
    }
    const datum = {
      ...data,
      experiment: experiment,
    }

    const debugDatum = DebugDataRepository.create(datum)
    await DebugDataRepository.save(debugDatum)
    res.status(201).json()
  } catch (err) {
    next(err)
  }
}

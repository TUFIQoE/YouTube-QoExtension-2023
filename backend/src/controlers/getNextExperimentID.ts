import type { Request, Response, NextFunction } from 'express'
import { ExperimentRepository } from '../database/repositories/experiment.repository'

export interface GetNextExperimentIDResponse {
  nextExperimentID: number
}

export const getNextExperimentID = async (req: Request, res: Response, NextFunction) => {
  const nextID = await ExperimentRepository.getNextId()
  const resData: GetNextExperimentIDResponse = {
    nextExperimentID: nextID,
  }
  res.status(200).json(resData)
}

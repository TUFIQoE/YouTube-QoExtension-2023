import { Request, Response, NextFunction } from 'express'
import { Experiment, SubjectSex } from '../database/entities/Experiment'
import { ExperimentRepository } from '../database/repositories/experiment.repository'

export interface PostExperimentRequestBody {
  subjectAge: number
  subjectSex: SubjectSex
  started: string
}

export const postExperiment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as PostExperimentRequestBody
    const experiment = await ExperimentRepository.createAndSave(data as Experiment)

    res.status(201).json(experiment)
  } catch (err) {
    next(err)
  }
}

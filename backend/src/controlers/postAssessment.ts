import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../utils/CustomError'
import { ExperimentRepository } from '../database/repositories/experiment.repository'
import { AssessmentRepository } from '../database/repositories/assessment.repository'

export interface PostAssessmentRequestBody {
  experimentID: number
  timestamp: string
  value: number
  description: string
  duration: number
}

export const postAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { experimentID, ...data } = req.body as PostAssessmentRequestBody
    const experiment = await ExperimentRepository.findOne({ where: { id: experimentID } })
    if (!experiment) {
      throw new CustomError(`Experiment with id ${experimentID} not found`, 400)
    }

    const asmt = AssessmentRepository.create({
      ...data,
      experiment,
    })
    await AssessmentRepository.save(asmt)

    res.status(201).json({ msg: 'OK' })
  } catch (err) {
    next(err)
  }
}

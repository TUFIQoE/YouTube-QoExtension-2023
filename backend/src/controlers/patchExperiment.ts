import { Request, Response, NextFunction } from 'express'
import { Experiment, SubjectSex } from '../database/entities/Experiment'
import { ExperimentRepository } from '../database/repositories/experiment.repository'
import { CustomError } from '../utils/CustomError'

export interface PatchExperimentRequestBody {
  ended: string
  experimentID: number
}

export const patchExperiment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as PatchExperimentRequestBody
    const experiment = await ExperimentRepository.findOne({
      where: {
        id: data.experimentID,
      },
    })
    if (!experiment) {
      throw new CustomError('Experiment not found', 400)
    }
    experiment.ended = data.ended
    await ExperimentRepository.save(experiment)

    res.status(200).json({
      msg: 'OK',
    })
  } catch (err) {
    next(err)
  }
}

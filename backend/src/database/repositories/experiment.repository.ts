import { Experiment } from '../entities/Experiment'
import { AppDataSource } from '..'

export const ExperimentRepository = AppDataSource.getRepository(Experiment).extend({
  createAndSave: async (experiment: Experiment) => {
    const newExperiment = ExperimentRepository.create(experiment)
    return await ExperimentRepository.save(newExperiment)
  },
  findByID: async (id: number) => {
    return await ExperimentRepository.findOneBy({ id: id })
  },
  getNextId: async () => {
    const experiments = await ExperimentRepository.find({
      order: {
        id: 'DESC',
      },
      take: 1,
    })
    return experiments[0] ? experiments[0].id + 1 : 1
  },
})

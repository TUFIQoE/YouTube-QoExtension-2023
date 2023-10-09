import { AppDataSource } from '..'
import { DebugData } from '../entities/DebugData'

export const DebugDataRepository = AppDataSource.getRepository(DebugData).extend({
  createAndSave: async (debugData: DebugData) => {
    const newDebugData = DebugDataRepository.create(debugData)
    return await DebugDataRepository.save(newDebugData)
  },
})

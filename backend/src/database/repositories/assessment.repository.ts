import { Assessment } from '../entities/Assessment'
import { AppDataSource } from '..'

export const AssessmentRepository = AppDataSource.getRepository(Assessment)

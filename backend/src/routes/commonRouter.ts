import { Router } from 'express'

import { postDebugDatum } from '../controlers/postDebugDatum'
import { postExperiment } from '../controlers/postExperiment'
import { postEvent } from '../controlers/postEvent'
import { postAssessment } from '../controlers/postAssessment'

import { getNextExperimentID } from '../controlers/getNextExperimentID'

import { patchExperiment } from '../controlers/patchExperiment'

const commonRouter = Router()

commonRouter.post('/debugDatum', postDebugDatum)
commonRouter.post('/experiment', postExperiment)
commonRouter.post('/assessment', postAssessment)
commonRouter.post('/event', postEvent)

commonRouter.get('/experiment/next/id', getNextExperimentID)

commonRouter.patch('/experiment', patchExperiment)

export default commonRouter

import { API_ENDPOINTS } from './config'
import axios from 'axios'

export const api = {
  debugData: {
    post: async (data: object) => {
      try {
        const response = await axios.post(API_ENDPOINTS.debugDatum.post, data)
        return response.data
      } catch (err) {
        throw err
      }
    },
  },
  experiment: {
    post: async (data: object) => {
      try {
        const response = await axios.post(API_ENDPOINTS.experiment.post, data)
        return response.data
      } catch (err) {
        throw err
      }
    },
    patch: async (data: object) => {
      try {
        const response = await axios.patch(API_ENDPOINTS.experiment.patch, data)
        return response.data
      } catch (err) {
        throw err
      }
    },
    id: {
      get: async (): Promise<number> => {
        try {
          const response = await axios.get(API_ENDPOINTS.experiment.id.get)
          return response.data.nextExperimentID
        } catch (err) {
          throw err
        }
      },
    },
  },
  assessment: {
    post: async (data: object) => {
      try {
        const response = await axios.post(API_ENDPOINTS.assessment.post, data)
        return response.data
      } catch (err) {
        throw err
      }
    },
  },
  event: {
    post: async (data: object) => {
      try {
        const response = await axios.post(API_ENDPOINTS.event.post, data)
        return response.data
      } catch (err) {
        throw err
      }
    },
  },
}

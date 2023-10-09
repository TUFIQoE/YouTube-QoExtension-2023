export const PORT = 8080
export const URL_BASE = `http://127.0.0.1:${PORT}`

export const API_ENDPOINTS = {
  experiment: {
    post: `${URL_BASE}/experiment`,
    patch: `${URL_BASE}/experiment`,
    id: {
      get: `${URL_BASE}/experiment/nextID`,
    },
  },
  debugDatum: {
    post: `${URL_BASE}/debugDatum`,
  },
  assessment: {
    post: `${URL_BASE}/assessment`,
  },
  event: {
    post: `${URL_BASE}/event`,
  },
}

import { api } from './api'

export const getFolders = (params = {}) => {
  return api.get('/folders', { params })
}

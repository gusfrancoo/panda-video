import { api } from './api'

export async function getVideos (params) {
  return api.post('/videos', params)
}

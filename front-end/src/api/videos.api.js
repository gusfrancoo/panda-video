import { api } from './api'

export async function getVideos (params) {
  return api.get('/videos', params)
}

export async function update (videoId, params) {
  return api.put(`/videos/${videoId}`, params)
}

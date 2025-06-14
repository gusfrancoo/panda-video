import axios from 'axios'
import redisClient from '../config/redis.js'
import { pandavideoApiUrl, pandavideoApiKey } from '../config/index.js'


const externalApi = axios.create({
  baseURL: pandavideoApiUrl,
  headers: {
    'Authorization': pandavideoApiKey,
    'Accept': 'application/json'
  }
})

//Acessa endpoints externos
async function fetchVideosFromSource(params) {
  const response = await externalApi.get('/videos', { params })
  return response.data
}

async function updateVideos(params, body) {
  try {
    const response = await externalApi.put(`/videos/${params}`, body)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar video: ', error)
    throw error
  }
}

//Lógica para acessar endpoints externos
export async function getVideos(params) {
  const key = `videos`
  const cached = await redisClient.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  const videos = await fetchVideosFromSource(params)

  await redisClient.set(key, JSON.stringify(videos), 'EX', 20)

  return videos
}

export async function update(params, body) {
  const videoId = params;
  const requestBody = body;
  const key = `videos`
  await redisClient.del(key)
  const resp = await updateVideos(videoId, requestBody)
  return resp.data
}
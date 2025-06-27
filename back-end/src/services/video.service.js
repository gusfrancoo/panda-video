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
async function fetchVideos(params) {
  const response = await externalApi.get('/videos')
  return response.data
}

async function fetchVideosById(params) {
  try {
    const response = await externalApi.get(`/videos/${params}`)
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar video: ', error)
    throw error
  }
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
  const videos = await fetchVideos(params)

  await redisClient.set(key, JSON.stringify(videos), 'EX', 20)

  return videos
}

export async function getVideoById(params) {
  const key = `video_${params}`
  
  const cached = await redisClient.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  const video = await fetchVideosById(params)
  
  await redisClient.set(key, JSON.stringify(video), 'EX', 20)

  return video
}

export async function update(params, body) {
  const videoId = params;
  const requestBody = body;
  const key = `video_${params}`
  await redisClient.del(key)
  await redisClient.del('videos')
  const resp = await updateVideos(videoId, requestBody)
  return resp
}
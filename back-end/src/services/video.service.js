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


async function fetchVideosFromSource(params) {
  const response = await externalApi.get('/videos', { params })
  return response.data
}


export async function getVideos(params) {
  const key = `videos:${JSON.stringify(params)}`

  const cached = await redisClient.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  const videos = await fetchVideosFromSource(params)

  await redisClient.set(key, JSON.stringify(videos), 'EX', 20)

  return videos
}
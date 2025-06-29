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

export const getFolders = async (queryParams = {}) => {
  try {
    
    const sortedKeys = Object.keys(queryParams).sort()
    const queryString = sortedKeys.map(key => `${key}=${queryParams[key]}`).join('&')
    const cacheKey = `folders:${queryString || 'all'}`
    const cached = await redisClient.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }
  
    console.log(`Cache MISS folders:${cacheKey}, buscando na API`)
    const { data } = await externalApi.get('/folders', { params: queryParams })
  
    if (Array.isArray(data?.folders)) {
      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 20)
    }
  
    return data
  } catch (error) {
    console.log('error');
    
  }
}


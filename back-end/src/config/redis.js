import Redis from 'ioredis'
import { redisUrl } from './index.js'  

const redisClient = new Redis(redisUrl)

redisClient.on('connect', () => {
  console.log('✔️ Redis conectado em', redisUrl)
})

redisClient.on('ready', () => {
  console.log('🟢 Redis pronto para aceitar comandos')
})

redisClient.on('error', err => {
  console.error('❌ Erro na conexão com o Redis:', err)
})

export default redisClient

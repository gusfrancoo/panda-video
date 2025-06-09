import Redis from 'ioredis'
import { redisUrl } from './index.js'  

// 1) Instancia o cliente apontando para a URL (do .env ou do docker-compose)
const redisClient = new Redis(redisUrl)

// 2) Listeners para validar a conexão
redisClient.on('connect', () => {
  console.log('✔️ Redis conectado em', redisUrl)
})
redisClient.on('ready', () => {
  console.log('🟢 Redis pronto para aceitar comandos')
})
redisClient.on('error', err => {
  console.error('❌ Erro na conexão com o Redis:', err)
})

// 3) Exporta o client para usar nos seus services
export default redisClient

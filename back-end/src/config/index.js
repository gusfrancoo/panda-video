import 'dotenv/config' 

export const port = process.env.PORT || 3000;
export const jwtSecret = process.env.JWT_SECRET;
export const databaseUrl = process.env.DATABASE_URL;
export const redisUrl = process.env.REDIS_URL;
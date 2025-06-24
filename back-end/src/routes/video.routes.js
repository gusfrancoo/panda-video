import { Router } from 'express'
import { fetchVideos, updateVideos } from "../controllers/video.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js'


const router = Router()

router.use(authMiddleware)

router.get('/', fetchVideos)

router.put('/:videoId', updateVideos)

export default router

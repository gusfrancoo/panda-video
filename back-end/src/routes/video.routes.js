import { Router } from 'express'
import { fetchVideos } from "../controllers/video.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js'


const router = Router()

router.use(authMiddleware)

router.post('/', fetchVideos)

export default router

import { Router } from 'express'
import { fetchFolders } from "../controllers/folders.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js'


const router = Router()

router.use(authMiddleware)

router.get('/', fetchFolders)

// router.put('/:videoId', updateVideos)

export default router

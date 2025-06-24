import { Router } from 'express';
import authRoutes from './auth.routes.js'
import videoRoutes from './video.routes.js'
import folderRoutes from './folder.routes.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/videos', videoRoutes);
router.use('/folders', folderRoutes);

export default router 
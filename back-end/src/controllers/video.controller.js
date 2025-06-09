import { getVideos } from '../services/video.service.js'

export async function fetchVideos(req, res) {
  try {
    const params = req.body.params ?? req.body
    const videos = await getVideos(params)
    return res.status(200).json(videos)
    
  } catch (err) {
    console.error('Erro no fetchVideos:', err)
    return res
      .status(500)
      .json({ error: 'Erro ao buscar vídeos. Tente novamente.' })
  }
}
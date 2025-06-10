import { getVideos, update } from '../services/video.service.js'

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

export async function updateVideos(req, res) {
  const { videoId } = req.params
  const { title, description, folder_id } = req.body.params
  try {
    const updated = await update(videoId, { title, description, folder_id })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
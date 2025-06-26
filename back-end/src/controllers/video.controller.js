import { getVideos, update, getVideoById } from '../services/video.service.js'

export async function fetchVideos(req, res) {
  try {
    const videos = await getVideos()
    return res.status(200).json(videos)
    
  } catch (err) {
    console.error('Erro no fetchVideos:', err)
    return res
      .status(500)
      .json({ error: 'Erro ao buscar vídeos. Tente novamente.' })
  }
}

export async function getVideoDetail(req, res) {
  try {

    const videoDetail = await getVideoById(req.params.videoId)
    console.log('videoDetail: ', videoDetail);
    return res.status(200).json(videoDetail)
    
  } catch (err) {
    console.error('Erro no fetchVideoById:', err)
    return res
      .status(500)
      .json({ error: 'Erro ao buscar os detalhes do vídeo. Tente novamente.' })
  }
}

export async function updateVideos(req, res) {
  const { videoId } = req.params
  const { title, description, folder_id } = req.body.params
  try {
    const updated = await update(videoId, { title, description, folder_id })
    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
import { getFolders } from '../services/folders.service.js'

export async function fetchFolders(req, res) {
  try {
    console.log('aqui:', req.query)
    const folders = await getFolders(req.query)
    return res.status(200).json(folders)
    
  } catch (err) {
    console.error('Erro no fetchFolder:', err)
    return res
      .status(500)
      .json({ error: 'Erro ao buscar pastas. Tente novamente.' })
  }
}


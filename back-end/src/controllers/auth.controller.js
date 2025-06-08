import { authenticateUser } from '../services/auth.service.js'


export async function login(req, res) {
  try {

    const { email, password } = req.body
    const token = await authenticateUser(email, password)
    return res.json({ token })

  } catch (err) {

    const status = /não encontrado|inválida/.test(err.message) ? 401 : 400
    return res.status(status).json({ error: err.message })

  }
}
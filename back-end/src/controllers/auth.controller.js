import { authenticateUser } from '../services/auth.service.js'


export async function login(req, res) {
  try {

    const { email, password } = req.body
    const token = await authenticateUser(email, password)
    return res.json({ token })

  } catch (err) {
    const message = err.message || ''
    const isExpectedAuthError = message === 'Usuário não encontrado' || message === 'Senha inválida'

    const status = isExpectedAuthError ? 400 : 500
    const userMessage = isExpectedAuthError
      ? message
      : 'Erro interno ao realizar login. Tente novamente mais tarde.'

    return res.status(status).json({
      error: userMessage,
      debug: process.env.NODE_ENV === 'development' ? message : undefined,
    })
  }
}
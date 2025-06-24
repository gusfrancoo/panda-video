import { authenticateUser } from '../services/auth.service.js'


export async function login(req, res) {
  try {

    const { email, password } = req.body
    const token = await authenticateUser(email, password)
    return res.json({ token })

  } catch (err) {

       const isAuthError = /não encontrado|inválida/.test(err.message)

    const status = isAuthError ? 401 : 500
    const userMessage = isAuthError
      ? 'E-mail ou senha inválidos. Verifique seus dados.'
      : 'Erro interno ao realizar login. Tente novamente mais tarde.'

    return res.status(status).json({
      error: userMessage,
      debug: process.env.NODE_ENV === 'development' ? err.message : undefined
    })

  }
}
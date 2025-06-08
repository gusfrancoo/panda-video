import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/index.js'
import { findByEmail } from '../models/user.model.js'

export async function authenticateUser(email, password) {
  try {

    const user = await findByEmail(email)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const match = await bcrypt.compare(password, user.password_hash)
    console.log('matchs: ', match);
    if (!match) {
      throw new Error('Senha inválida')
    }

    return jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '1h' }
    )
  } catch (error) {
    console.error('Erro no service authenticateUser:', error)
    throw error
  }
}

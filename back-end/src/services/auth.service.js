import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/index.js'
import prisma from '../lib/prisma.js'


export async function authenticateUser(email, password) {
  try {

    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      throw new Error('Senha inválida')
    }
    return jwt.sign(
      { id: user.id.toString(), email: user.email },
      jwtSecret,
      { expiresIn: '1h' }
    )
  } catch (error) {
    console.error('Erro no service authenticateUser:', error)
    throw error
  }
}

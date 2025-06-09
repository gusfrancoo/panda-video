import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/index.js'

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const [, token] = authHeader.split(' ')
  if (!token) {
    return res.status(401).json({ error: 'Token malformado' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.userId = decoded.id
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

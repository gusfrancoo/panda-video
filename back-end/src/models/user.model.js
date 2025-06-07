import { query } from '../config/db.js'

export async function findByEmail(email) {
  const res = await query(
    'SELECT UNIQUE id, email, password_hash FROM users WHERE email = $1',
    [email]
  )
  return res.rows
}
import { query } from '../config/db.js'

export async function findByEmail(email) {
  try {
    
    const res = await query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    )
    return res.rows[0]
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}
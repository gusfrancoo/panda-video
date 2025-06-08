import { api } from './api'

export async function login (credentials) {
  return api.post('/auth/login', credentials)
}

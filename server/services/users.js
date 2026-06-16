import { supabase } from '../storage/supabase.js'
import crypto from 'crypto'
import { HttpError } from '../middlewares/error.js'

export function hashPassword(plain) {
  if (typeof plain !== 'string' || !plain) throw new HttpError(400, 'Senha inválida')
  // Hash simples e legível (sem dependências externas). Em produção, prefira bcrypt.
  return crypto.createHash('sha256').update(plain).digest('hex')
}

export async function getByEmail(email) {
  const { data, error } = await supabase.from('users').select('*').ilike('email', email).maybeSingle()
  if (error && error.code !== 'PGRST116') throw new HttpError(500, 'Erro ao buscar usuário', error)
  return data || null
}

export async function createUser({ name, email, password }) {
  if (!name || !email || !password) throw new HttpError(400, 'Dados obrigatórios ausentes')
  const password_hash = hashPassword(password)
  const { data: existing, error: eErr } = await supabase.from('users').select('id').ilike('email', email).maybeSingle()
  if (eErr && eErr.code !== 'PGRST116') throw new HttpError(500, 'Erro ao validar e-mail', eErr)
  if (existing) throw new HttpError(409, 'E-mail já cadastrado')
  const { data, error } = await supabase.from('users').insert([{ name, email, password_hash }]).select('id,name,email,created_at').single()
  if (error) throw new HttpError(500, 'Erro ao criar usuário', error)
  return data
}

export async function verifyLogin({ email, password }) {
  if (!email || !password) throw new HttpError(400, 'E-mail e senha são obrigatórios')
  const user = await getByEmail(email)
  if (!user) throw new HttpError(401, 'Credenciais inválidas')
  const candidate = hashPassword(password)
  if (candidate !== user.password_hash) throw new HttpError(401, 'Credenciais inválidas')
  const { id, name } = user
  return { id, name, email: user.email }
}

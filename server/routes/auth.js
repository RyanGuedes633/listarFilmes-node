import { Router } from 'express'
import { validateBody } from '../middlewares/validate.js'
import * as users from '../services/users.js'

const router = Router()

const registerSchema = {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
}

const loginSchema = {
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
}

router.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const user = await users.createUser(req.validatedBody)
    res.status(201).json(user)
  } catch (e) { next(e) }
})

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const user = await users.verifyLogin(req.validatedBody)
    // Sem JWT/sessão: apenas retorna os dados públicos do usuário
    res.json(user)
  } catch (e) { next(e) }
})

export default router

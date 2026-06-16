import { HttpError } from './error.js';

/**
 * Middleware para exigir que o cabeçalho X-User-Id esteja presente,
 * extraindo o ID do usuário para associá-lo nas consultas do banco.
 */
export function requireAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return next(new HttpError(401, 'Autenticação necessária. Cabeçalho X-User-Id ausente.'));
  }
  
  req.userId = userId;
  next();
}

import { Router } from 'express';
import * as controller from '../controllers/movies.js';
import { validateBody } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.use(requireAuth);

const createSchema = {
  titulo: { type: 'string', required: true },
  faixaEtaria: { type: 'number', required: true, min: 0 },
  genero: { type: 'string', required: true },
  atores: { type: 'array', items: 'number' },
};
const updateSchema = {
  titulo: { type: 'string' },
  faixaEtaria: { type: 'number', min: 0 },
  genero: { type: 'string' },
  atores: { type: 'array', items: 'number' },
};

router.get('/', controller.list);
router.get('/tmdb/popular', controller.listTmdb);
router.post('/tmdb/favorite', controller.favoriteFromTmdb);
router.get('/:id', controller.get);
router.post('/', validateBody(createSchema), controller.create);
router.put('/:id', validateBody(updateSchema), controller.update);
router.delete('/:id', controller.remove);

export default router;

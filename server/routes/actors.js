import { Router } from 'express';
import * as controller from '../controllers/actors.js';
import { validateBody } from '../middlewares/validate.js';

const router = Router();

const actorSchema = { nome: { type: 'string', required: true } };

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', validateBody(actorSchema), controller.create);
router.put('/:id', validateBody(actorSchema), controller.update);
router.delete('/:id', controller.remove);

export default router;

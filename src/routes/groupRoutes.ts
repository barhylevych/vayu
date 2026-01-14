import { Router } from 'express';
import { GroupController } from '../controllers/groupController';
import { validate } from '../middleware/validation';
import { paginationQuerySchema } from '../types';

const router = Router();

router.get('/', validate(paginationQuerySchema), GroupController.getAllGroups);

export default router;

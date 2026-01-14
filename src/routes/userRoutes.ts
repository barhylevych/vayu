import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validate } from '../middleware/validation';
import {
  paginationQuerySchema,
  removeUserFromGroupParamsSchema,
} from '../types';

const router = Router();

router.get('/', validate(paginationQuerySchema), UserController.getAllUsers);

router.delete(
  '/:userId/groups/:groupId',
  validate(removeUserFromGroupParamsSchema, 'params'),
  UserController.removeUserFromGroup
);

export default router;

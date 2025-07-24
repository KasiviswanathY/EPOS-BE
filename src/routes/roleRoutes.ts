import { Router } from 'express';
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from 'src/controllers/roleController';

const router = Router();

router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;

import { Router } from 'express';

import {
  createProduct,
  getProductById,
} from '../controllers/productsController';

const router = Router();

router.get('/:id', getProductById);
router.post('/', createProduct);

export default router;

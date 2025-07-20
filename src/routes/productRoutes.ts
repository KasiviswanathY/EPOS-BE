import { Router } from 'express';

import {
  createProduct,
  getProductById,
} from 'src/controllers/productsController';

const router = Router();

router.get('/:id', getProductById);
router.post('/', createProduct);

export default router;

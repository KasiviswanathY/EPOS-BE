import { Router } from "express";

import { getProductById } from "src/controllers/productsController";

const router = Router();

router.get("/:id", getProductById)

export default router;
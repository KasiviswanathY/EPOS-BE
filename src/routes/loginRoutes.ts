import { Router } from 'express';
import { loginUser } from 'src/controllers/loginController';

const router = Router();

router.post('/', loginUser);

export default router;

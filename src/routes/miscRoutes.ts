import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /misc/healthCheck:
 *   get:
 *     summary: Health Check
 *     tags:
 *       - Miscellaneous
 *     responses:
 *       200:
 *         description: Service is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/healthCheck', (req: any, res: any) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

export default router;

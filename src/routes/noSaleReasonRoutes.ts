import { Router } from 'express';
import {
  createNoSaleReason,
  getNoSaleReasons,
  getNoSaleReasonById,
  updateNoSaleReason,
  deleteNoSaleReason,
} from '../controllers/noSaleReasonController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: NoSaleReason
 *     description: No sale reason management endpoints
 */

/**
 * @openapi
 * /no-sale-reasons:
 *   post:
 *     summary: Create a new no sale reason
 *     tags:
 *       - NoSaleReason
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: No sale reason created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoSaleReason'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/', createNoSaleReason);

/**
 * @openapi
 * /no-sale-reasons:
 *   get:
 *     summary: Get all no sale reasons
 *     tags:
 *       - NoSaleReason
 *     responses:
 *       200:
 *         description: List of no sale reasons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NoSaleReason'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getNoSaleReasons);

/**
 * @openapi
 * /no-sale-reasons/{id}:
 *   get:
 *     summary: Get no sale reason by ID
 *     tags:
 *       - NoSaleReason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: No sale reason found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoSaleReason'
 *       404:
 *         description: No sale reason not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getNoSaleReasonById);

/**
 * @openapi
 * /no-sale-reasons/{id}:
 *   patch:
 *     summary: Update a no sale reason
 *     tags:
 *       - NoSaleReason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: No sale reason updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoSaleReason'
 *       404:
 *         description: No sale reason not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', updateNoSaleReason);

/**
 * @openapi
 * /no-sale-reasons/{id}:
 *   delete:
 *     summary: Delete a no sale reason
 *     tags:
 *       - NoSaleReason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: No sale reason deleted successfully
 *       404:
 *         description: No sale reason not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteNoSaleReason);

export default router;

import { Router } from 'express';
import {
  createRefundReason,
  getRefundReasons,
  getRefundReasonById,
  updateRefundReason,
  deleteRefundReason
} from '../controllers/refundReasonController';

const router = Router();

/**
 * @openapi
 * /refund-reasons:
 *   post:
 *     summary: Create a new refund reason
 *     tags:
 *       - RefundReason
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - shortDescription
 *             properties:
 *               description:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               returnToStock:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Refund reason created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefundReason'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/', createRefundReason);

/**
 * @openapi
 * /refund-reasons:
 *   get:
 *     summary: Get all refund reasons
 *     tags:
 *       - RefundReason
 *     responses:
 *       200:
 *         description: List of refund reasons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RefundReason'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getRefundReasons);

/**
 * @openapi
 * /refund-reasons/{id}:
 *   get:
 *     summary: Get refund reason by ID
 *     tags:
 *       - RefundReason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refund reason found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefundReason'
 *       404:
 *         description: Refund reason not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getRefundReasonById);

/**
 * @openapi
 * /refund-reasons/{id}:
 *   patch:
 *     summary: Update a refund reason
 *     tags:
 *       - RefundReason
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
 *               description:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               returnToStock:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Refund reason updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefundReason'
 *       404:
 *         description: Refund reason not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', updateRefundReason);

/**
 * @openapi
 * /refund-reasons/{id}:
 *   delete:
 *     summary: Delete a refund reason
 *     tags:
 *       - RefundReason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refund reason deleted successfully
 *       404:
 *         description: Refund reason not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteRefundReason);

export default router;

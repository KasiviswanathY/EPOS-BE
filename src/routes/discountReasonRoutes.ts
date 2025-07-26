import { Router } from 'express';
import {
  createDiscountReason,
  getDiscountReasons,
  getDiscountReasonById,
  updateDiscountReason,
  deleteDiscountReason
} from '../controllers/discountReasonController';

const router = Router();

/**
 * @openapi
 * /discount-reasons:
 *   post:
 *     summary: Create a new discount reason
 *     tags:
 *       - DiscountReason
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountReason'
 *     responses:
 *       201:
 *         description: Discount reason created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountReason'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/', createDiscountReason);

/**
 * @openapi
 * /discount-reasons:
 *   get:
 *     summary: Get all discount reasons
 *     tags:
 *       - DiscountReason
 *     responses:
 *       200:
 *         description: List of discount reasons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountReason'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getDiscountReasons);

/**
 * @openapi
 * /discount-reasons/{id}:
 *   get:
 *     summary: Get discount reason by ID
 *     tags:
 *       - DiscountReason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount reason found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountReason'
 *       404:
 *         description: Discount reason not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getDiscountReasonById);

/**
 * @openapi
 * /discount-reasons/{id}:
 *   patch:
 *     summary: Update a discount reason
 *     tags:
 *       - DiscountReason
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
 *             $ref: '#/components/schemas/DiscountReason'
 *     responses:
 *       200:
 *         description: Discount reason updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscountReason'
 *       404:
 *         description: Discount reason not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', updateDiscountReason);

/**
 * @openapi
 * /discount-reasons/{id}:
 *   delete:
 *     summary: Delete a discount reason
 *     tags:
 *       - DiscountReason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount reason deleted successfully
 *       404:
 *         description: Discount reason not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteDiscountReason);

export default router;

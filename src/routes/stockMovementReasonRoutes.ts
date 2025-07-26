import express from 'express';
import {
  createStockMovementReason,
  getAllStockMovementReasons,
  getStockMovementReasonById,
  updateStockMovementReason,
  deleteStockMovementReason,
} from '../controllers/stockMovementReasonController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     StockMovementReason:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the stock movement reason
 *         reason:
 *           type: string
 *           description: The stock movement reason name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update date
 *       example:
 *         id: d5fE_asz
 *         reason: "Damaged goods"
 *         createdAt: "2023-07-26T10:00:00.000Z"
 *         updatedAt: "2023-07-26T10:00:00.000Z"
 *     CreateStockMovementReason:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           description: The stock movement reason name
 *       example:
 *         reason: "Damaged goods"
 */

/**
 * @swagger
 * tags:
 *   name: Stock Movement Reasons
 *   description: The stock movement reasons managing API
 */

/**
 * @swagger
 * /stock-movement-reasons:
 *   post:
 *     summary: Create a new stock movement reason
 *     tags: [Stock Movement Reasons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockMovementReason'
 *     responses:
 *       201:
 *         description: The stock movement reason was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovementReason'
 *       400:
 *         description: Stock movement reason with this name already exists
 *       500:
 *         description: Some server error
 */
router.post('/', createStockMovementReason);

/**
 * @swagger
 * /stock-movement-reasons:
 *   get:
 *     summary: Returns the list of all stock movement reasons
 *     tags: [Stock Movement Reasons]
 *     responses:
 *       200:
 *         description: The list of stock movement reasons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockMovementReason'
 */
router.get('/', getAllStockMovementReasons);

/**
 * @swagger
 * /stock-movement-reasons/{id}:
 *   get:
 *     summary: Get the stock movement reason by id
 *     tags: [Stock Movement Reasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock movement reason id
 *     responses:
 *       200:
 *         description: The stock movement reason description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovementReason'
 *       404:
 *         description: The stock movement reason was not found
 */
router.get('/:id', getStockMovementReasonById);

/**
 * @swagger
 * /stock-movement-reasons/{id}:
 *   put:
 *     summary: Update the stock movement reason by the id
 *     tags: [Stock Movement Reasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock movement reason id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockMovementReason'
 *     responses:
 *       200:
 *         description: The stock movement reason was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovementReason'
 *       400:
 *         description: Stock movement reason with this name already exists
 *       404:
 *         description: The stock movement reason was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', updateStockMovementReason);

/**
 * @swagger
 * /stock-movement-reasons/{id}:
 *   delete:
 *     summary: Remove the stock movement reason by id
 *     tags: [Stock Movement Reasons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock movement reason id
 *     responses:
 *       204:
 *         description: The stock movement reason was deleted
 *       404:
 *         description: The stock movement reason was not found
 */
router.delete('/:id', deleteStockMovementReason);

export default router;

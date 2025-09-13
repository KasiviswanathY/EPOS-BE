import express from 'express';
import {
  getStockMovements,
  getStockMovementById,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement,
  bulkCreateStockMovements,
} from '../controllers/stockMovementController';
import { authHandler } from '../handlers/authHandler';

const router = express.Router();

/**
 * @openapi
 * /api/v1/stock-movements:
 *   get:
 *     summary: Get all stock movements
 *     tags:
 *       - Stock Movements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INITIAL_STOCK, PURCHASE, SALE, ADJUSTMENT, RETURN, TRANSFER_IN, TRANSFER_OUT, DAMAGED, EXPIRED]
 *         description: Filter by movement type
 *       - in: query
 *         name: stockId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by stock ID
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by product ID
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by location ID
 *     responses:
 *       200:
 *         description: List of stock movements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockMovement'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.get('/', authHandler, getStockMovements);

/**
 * @openapi
 * /api/v1/stock-movements/{id}:
 *   get:
 *     summary: Get a stock movement by ID
 *     tags:
 *       - Stock Movements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Stock movement ID
 *     responses:
 *       200:
 *         description: Stock movement details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stock movement not found
 *       500:
 *         description: Server Error
 */
router.get('/:id', authHandler, getStockMovementById);

/**
 * @openapi
 * /api/v1/stock-movements:
 *   post:
 *     summary: Create a new stock movement
 *     tags:
 *       - Stock Movements
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockMovement'
 *     responses:
 *       201:
 *         description: Stock movement created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.post('/', authHandler, createStockMovement);

/**
 * @openapi
 * /api/v1/stock-movements/bulk:
 *   post:
 *     summary: Create multiple stock movements in a single request
 *     tags:
 *       - Stock Movements
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movements
 *             properties:
 *               movements:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CreateStockMovement'
 *                 minItems: 1
 *     responses:
 *       201:
 *         description: Stock movements created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of stock movements created
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockMovement'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.post('/bulk', authHandler, bulkCreateStockMovements);

/**
 * @openapi
 * /api/v1/stock-movements/{id}:
 *   put:
 *     summary: Update a stock movement
 *     tags:
 *       - Stock Movements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Stock movement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStockMovement'
 *     responses:
 *       200:
 *         description: Stock movement updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stock movement not found
 *       500:
 *         description: Server Error
 */
router.put('/:id', authHandler, updateStockMovement);

/**
 * @openapi
 * /api/v1/stock-movements/{id}:
 *   delete:
 *     summary: Delete a stock movement
 *     tags:
 *       - Stock Movements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Stock movement ID
 *     responses:
 *       200:
 *         description: Stock movement deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stock movement not found
 *       500:
 *         description: Server Error
 */
router.delete('/:id', authHandler, deleteStockMovement);

export default router;

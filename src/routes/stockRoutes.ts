import { Router } from 'express';
import {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  adjustStock,
  deleteStock,
  getLowStockItems,
} from '../controllers/stockController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Stock
 *     description: Stock management endpoints
 */

/**
 * @openapi
 * /stock:
 *   get:
 *     summary: Get all stock records with pagination and filtering
 *     tags:
 *       - Stock
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
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
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         description: Filter low stock items only
 *     responses:
 *       200:
 *         description: List of stock records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stock'
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
 *         description: Internal server error
 */
router.get('/', getStocks);

/**
 * @openapi
 * /stock/low-stock:
 *   get:
 *     summary: Get low stock items
 *     tags:
 *       - Stock
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by location ID
 *     responses:
 *       200:
 *         description: List of low stock items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stock'
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
 *         description: Internal server error
 */
router.get('/low-stock', getLowStockItems);

/**
 * @openapi
 * /stock/{id}:
 *   get:
 *     summary: Get a stock record by ID
 *     tags:
 *       - Stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The stock record ID
 *     responses:
 *       200:
 *         description: Stock record details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stock record not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getStockById);

/**
 * @openapi
 * /stock:
 *   post:
 *     summary: Create a new stock record
 *     tags:
 *       - Stock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - locationId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: Product ID
 *               locationId:
 *                 type: string
 *                 format: uuid
 *                 description: Location ID
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 description: Initial stock quantity
 *               minStockLevel:
 *                 type: integer
 *                 minimum: 0
 *                 description: Minimum stock level for alerts
 *               maxStockLevel:
 *                 type: integer
 *                 minimum: 0
 *                 description: Maximum stock level
 *               reorderLevel:
 *                 type: integer
 *                 minimum: 0
 *                 description: Stock level at which to reorder
 *     responses:
 *       201:
 *         description: Stock record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product or location not found
 *       409:
 *         description: Stock record already exists for this product at this location
 *       500:
 *         description: Internal server error
 */
router.post('/', createStock);

/**
 * @openapi
 * /stock/{id}:
 *   patch:
 *     summary: Update stock settings
 *     tags:
 *       - Stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The stock record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minStockLevel:
 *                 type: integer
 *                 minimum: 0
 *                 description: Minimum stock level for alerts
 *               maxStockLevel:
 *                 type: integer
 *                 minimum: 0
 *                 description: Maximum stock level
 *               reorderLevel:
 *                 type: integer
 *                 minimum: 0
 *                 description: Stock level at which to reorder
 *     responses:
 *       200:
 *         description: Stock record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stock record not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateStock);

/**
 * @openapi
 * /stock/{id}/adjust:
 *   post:
 *     summary: Adjust stock quantity
 *     tags:
 *       - Stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The stock record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - quantity
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [PURCHASE, ADJUSTMENT, RETURN, TRANSFER_IN, TRANSFER_OUT, DAMAGED, EXPIRED]
 *                 description: Type of stock adjustment
 *               quantity:
 *                 type: integer
 *                 description: Quantity to adjust (positive for increase, negative for decrease)
 *               reason:
 *                 type: string
 *                 description: Reason for stock adjustment
 *               reference:
 *                 type: string
 *                 description: Reference number (order ID, transfer ID, etc.)
 *     responses:
 *       200:
 *         description: Stock adjusted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Bad request - invalid data or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stock record not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/adjust', adjustStock);

/**
 * @openapi
 * /stock/{id}:
 *   delete:
 *     summary: Delete a stock record
 *     tags:
 *       - Stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The stock record ID
 *     responses:
 *       200:
 *         description: Stock record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock record deleted successfully
 *       400:
 *         description: Cannot delete stock record with remaining quantity
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stock record not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteStock);

export default router;

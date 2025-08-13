import { Router } from 'express';
import {
  getBarCodes,
  getBarCodeById,
  createBarCode,
  updateBarCode,
  deleteBarCode,
} from '../controllers/barCodeController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: BarCodes
 *     description: Barcode management endpoints
 */

/**
 * @openapi
 * /barcodes:
 *   get:
 *     summary: Get all barcodes with pagination
 *     tags:
 *       - BarCodes
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
 *     responses:
 *       200:
 *         description: List of barcodes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BarCode'
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
 *         description: Internal Server Error
 */
router.get('/', getBarCodes);

/**
 * @openapi
 * /barcodes/{id}:
 *   get:
 *     summary: Get a barcode by ID
 *     tags:
 *       - BarCodes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Barcode ID
 *     responses:
 *       200:
 *         description: Barcode details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BarCode'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Barcode not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getBarCodeById);

/**
 * @openapi
 * /barcodes:
 *   post:
 *     summary: Create a new barcode
 *     tags:
 *       - BarCodes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBarCode'
 *     responses:
 *       201:
 *         description: Barcode created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BarCode'
 *       400:
 *         description: Invalid input or barcode already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/', createBarCode);

/**
 * @openapi
 * /barcodes/{id}:
 *   patch:
 *     summary: Update a barcode
 *     tags:
 *       - BarCodes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Barcode ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBarCode'
 *     responses:
 *       200:
 *         description: Barcode updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BarCode'
 *       400:
 *         description: Invalid input or barcode already exists
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Barcode not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', updateBarCode);

/**
 * @openapi
 * /barcodes/{id}:
 *   delete:
 *     summary: Delete a barcode
 *     tags:
 *       - BarCodes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Barcode ID
 *     responses:
 *       200:
 *         description: Barcode deleted successfully
 *       400:
 *         description: Cannot delete barcode associated with a product
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Barcode not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteBarCode);

export default router;

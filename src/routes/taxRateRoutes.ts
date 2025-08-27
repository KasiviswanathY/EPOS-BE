import { Router } from 'express';
import {
  getTaxRates,
  getTaxRateById,
  createTaxRate,
  updateTaxRate,
  deleteTaxRate,
} from '../controllers/taxRateController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Tax Rates
 *     description: Tax rate management endpoints
 */

/**
 * @openapi
 * /tax-rates:
 *   get:
 *     summary: Get all tax rates with pagination
 *     tags:
 *       - Tax Rates
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
 *         description: List of tax rates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TaxRate'
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
router.get('/', getTaxRates);

/**
 * @openapi
 * /tax-rates/{id}:
 *   get:
 *     summary: Get a tax rate by ID
 *     tags:
 *       - Tax Rates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The tax rate ID
 *     responses:
 *       200:
 *         description: Tax rate details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaxRate'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tax rate not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getTaxRateById);

/**
 * @openapi
 * /tax-rates:
 *   post:
 *     summary: Create a new tax rate
 *     tags:
 *       - Tax Rates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - percentage
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the tax rate
 *               percentage:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Tax rate percentage (0-100)
 *     responses:
 *       201:
 *         description: Tax rate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaxRate'
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Tax rate with name already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', createTaxRate);

/**
 * @openapi
 * /tax-rates/{id}:
 *   patch:
 *     summary: Update a tax rate
 *     tags:
 *       - Tax Rates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The tax rate ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the tax rate
 *               percentage:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Tax rate percentage (0-100)
 *     responses:
 *       200:
 *         description: Tax rate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaxRate'
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tax rate not found
 *       409:
 *         description: Tax rate with name already exists
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateTaxRate);

/**
 * @openapi
 * /tax-rates/{id}:
 *   delete:
 *     summary: Delete a tax rate
 *     tags:
 *       - Tax Rates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The tax rate ID
 *     responses:
 *       200:
 *         description: Tax rate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tax rate deleted successfully
 *       400:
 *         description: Cannot delete tax rate with associated products
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tax rate not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteTaxRate);

export default router;

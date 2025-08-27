import { Router } from 'express';
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Brands
 *     description: Brand management endpoints
 */

/**
 * @openapi
 * /brands:
 *   get:
 *     summary: Get all brands with pagination
 *     tags:
 *       - Brands
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by brand status
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
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
router.get('/', getBrands);

/**
 * @openapi
 * /brands/{id}:
 *   get:
 *     summary: Get a brand by ID
 *     tags:
 *       - Brands
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: Brand details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getBrandById);

/**
 * @openapi
 * /brands:
 *   post:
 *     summary: Create a new brand
 *     tags:
 *       - Brands
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the brand
 *               description:
 *                 type: string
 *                 description: Optional description of the brand
 *               status:
 *                 type: string
 *                 description: Current status of the brand
 *               productOrderCode:
 *                 type: string
 *                 description: Product order code for the brand
 *               articleCode:
 *                 type: string
 *                 description: Article code for the brand
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Brand with name, product order code, or article code already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', createBrand);

/**
 * @openapi
 * /brands/{id}:
 *   patch:
 *     summary: Update a brand
 *     tags:
 *       - Brands
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the brand
 *               description:
 *                 type: string
 *                 description: Optional description of the brand
 *               status:
 *                 type: string
 *                 description: Current status of the brand
 *               productOrderCode:
 *                 type: string
 *                 description: Product order code for the brand
 *               articleCode:
 *                 type: string
 *                 description: Article code for the brand
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Brand not found
 *       409:
 *         description: Brand with name, product order code, or article code already exists
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateBrand);

/**
 * @openapi
 * /brands/{id}:
 *   delete:
 *     summary: Delete a brand
 *     tags:
 *       - Brands
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Brand deleted successfully
 *       400:
 *         description: Cannot delete brand with associated products
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteBrand);

export default router;

import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController';
import productImageRoutes from './productImageRoutes';
import { uploadMultiple } from '../controllers/productImageController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Product management endpoints
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products with pagination
 *     tags:
 *       - Products
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
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
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
router.get('/', getProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getProductById);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product with optional images
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - salePrice
 *               - costPrice
 *               - unitOfSale
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name (required)
 *               description:
 *                 type: string
 *                 description: Product description
 *               costPrice:
 *                 type: number
 *                 description: Cost price (required)
 *               salePrice:
 *                 type: number
 *                 description: Sale price (required)
 *               unitOfSale:
 *                 type: string
 *                 enum: [cards, each, kg, litre, packet, cl, cm, cup, ft, g, gal, halfPint, in, l, lb, ml, m, oz]
 *                 description: Unit of sale (required)
 *               categoryId:
 *                 type: string
 *                 description: Category ID (required)
 *               brandId:
 *                 type: string
 *                 description: Brand ID
 *               taxRateId:
 *                 type: string
 *                 description: Tax rate ID
 *               productTagId:
 *                 type: string
 *                 description: Product tag ID
 *               containerFeeId:
 *                 type: string
 *                 description: Container fee ID
 *               mulitChoiceProductGroupId:
 *                 type: string
 *                 description: Multi-choice product group ID
 *               posOrder:
 *                 type: string
 *                 description: Position order - must be unique across all products
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product image files (up to 5 images, optional)
 *               isPrimaryImage:
 *                 type: array
 *                 items:
 *                   type: boolean
 *                 description: Whether the corresponding image is a primary image (array index should match images array)
 *               imageAltText:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Alternative text for each image (array index should match images array)
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/', uploadMultiple.array('images', 5), createProduct);

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: Update a product with optional images
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               costPrice:
 *                 type: number
 *                 description: Cost price
 *               salePrice:
 *                 type: number
 *                 description: Sale price
 *               unitOfSale:
 *                 type: string
 *                 enum: [cards, each, kg, litre, packet, cl, cm, cup, ft, g, gal, halfPint, in, l, lb, ml, m, oz]
 *                 description: Unit of sale
 *               posOrder:
 *                 type: string
 *                 description: Position order - must be unique across all products
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product image files (up to 5 images, optional)
 *               isPrimaryImage:
 *                 type: array
 *                 items:
 *                   type: boolean
 *                 description: Whether the corresponding image is a primary image (array index should match images array)
 *               imageAltText:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Alternative text for each image (array index should match images array)
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', uploadMultiple.array('images', 5), updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteProduct);

// Use product image routes
router.use('/:productId/images', productImageRoutes);

export default router;

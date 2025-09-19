import { Router } from 'express';
import { 
  uploadProductImage, 
  getProductImages, 
  getProductImage, 
  updateProductImage, 
  deleteProductImage,
  upload
} from '../controllers/productImageController';

const router = Router({ mergeParams: true });

/**
 * @openapi
 * tags:
 *   - name: ProductImages
 *     description: API for managing product images
 */

/**
 * @openapi
 * /products/{productId}/images:
 *   get:
 *     summary: Get all images for a product
 *     tags:
 *       - ProductImages
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: List of product images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductImage'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getProductImages);

/**
 * @openapi
 * /products/{productId}/images:
 *   post:
 *     summary: Upload a new image for a product
 *     tags:
 *       - ProductImages
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *               isPrimary:
 *                 type: boolean
 *                 description: Whether this is the primary product image
 *               altText:
 *                 type: string
 *                 description: Alternative text for the image
 *               sortOrder:
 *                 type: integer
 *                 description: Order for displaying multiple images
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductImage'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/', upload.single('image'), uploadProductImage);

/**
 * @openapi
 * /products/{productId}/images/{imageId}:
 *   get:
 *     summary: Get a specific product image
 *     tags:
 *       - ProductImages
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *       - in: path
 *         name: imageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The image ID
 *     responses:
 *       200:
 *         description: Image data
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */
router.get('/:imageId', getProductImage);

/**
 * @openapi
 * /products/{productId}/images/{imageId}:
 *   patch:
 *     summary: Update image metadata
 *     tags:
 *       - ProductImages
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *       - in: path
 *         name: imageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The image ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPrimary:
 *                 type: boolean
 *                 description: Whether this is the primary product image
 *               altText:
 *                 type: string
 *                 description: Alternative text for the image
 *               sortOrder:
 *                 type: integer
 *                 description: Order for displaying multiple images
 *     responses:
 *       200:
 *         description: Image metadata updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductImage'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:imageId', updateProductImage);

/**
 * @openapi
 * /products/{productId}/images/{imageId}:
 *   delete:
 *     summary: Delete a product image
 *     tags:
 *       - ProductImages
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *       - in: path
 *         name: imageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:imageId', deleteProductImage);

export default router;

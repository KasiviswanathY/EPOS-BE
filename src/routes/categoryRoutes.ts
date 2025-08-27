import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Categories
 *     description: Category management endpoints
 */

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get all categories with pagination
 *     tags:
 *       - Categories
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
 *         name: parentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by parent category ID
 *       - in: query
 *         name: showonTill
 *         schema:
 *           type: boolean
 *         description: Filter by whether category is shown on till
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
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
router.get('/', getCategories);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getCategoryById);

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
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
 *                 description: The name of the category
 *               description:
 *                 type: string
 *                 description: Optional description of the category
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the parent category if this is a subcategory
 *               reportCategory:
 *                 type: string
 *                 description: Category used for reporting purposes
 *               wetOrDry:
 *                 type: string
 *                 enum: [WET, DRY]
 *                 default: WET
 *                 description: Whether this is a wet or dry category
 *               showonTill:
 *                 type: boolean
 *                 default: true
 *                 description: Whether to show this category on the till
 *               nominalCode:
 *                 type: string
 *                 description: Nominal code for accounting purposes
 *               popupNoteId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the associated popup note
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Category with name or nominal code already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', createCategory);

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *               description:
 *                 type: string
 *                 description: Optional description of the category
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the parent category if this is a subcategory
 *               reportCategory:
 *                 type: string
 *                 description: Category used for reporting purposes
 *               wetOrDry:
 *                 type: string
 *                 enum: [WET, DRY]
 *                 description: Whether this is a wet or dry category
 *               showonTill:
 *                 type: boolean
 *                 description: Whether to show this category on the till
 *               nominalCode:
 *                 type: string
 *                 description: Nominal code for accounting purposes
 *               popupNoteId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the associated popup note
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category with name or nominal code already exists
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateCategory);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       400:
 *         description: Cannot delete category with associated products, promotions, or child categories
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteCategory);

export default router;

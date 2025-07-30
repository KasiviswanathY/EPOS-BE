import express from 'express';
import {
  createCustomerType,
  getCustomerTypes,
  getCustomerTypeById,
  updateCustomerType,
  deleteCustomerType,
} from '../controllers/customerTypeController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customer Types
 *   description: The customer types managing API
 */

/**
 * @swagger
 * /customer-types:
 *   post:
 *     summary: Create a new customer type
 *     tags: [Customer Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerType'
 *     responses:
 *       201:
 *         description: The customer type was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerType'
 *       500:
 *         description: Some server error
 */
router.post('/', createCustomerType);

/**
 * @swagger
 * /customer-types:
 *   get:
 *     summary: Returns the list of all customer types
 *     tags: [Customer Types]
 *     responses:
 *       200:
 *         description: The list of customer types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerType'
 */
router.get('/', getCustomerTypes);

/**
 * @swagger
 * /customer-types/{id}:
 *   get:
 *     summary: Get the customer type by id
 *     tags: [Customer Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer type id
 *     responses:
 *       200:
 *         description: The customer type description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerType'
 *       404:
 *         description: The customer type was not found
 */
router.get('/:id', getCustomerTypeById);

/**
 * @swagger
 * /customer-types/{id}:
 *   put:
 *     summary: Update the customer type by the id
 *     tags: [Customer Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer type id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerType'
 *     responses:
 *       200:
 *         description: The customer type was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerType'
 *       404:
 *         description: The customer type was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', updateCustomerType);

/**
 * @swagger
 * /customer-types/{id}:
 *   delete:
 *     summary: Remove the customer type by id
 *     tags: [Customer Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer type id
 *     responses:
 *       200:
 *         description: The customer type was deleted
 *       404:
 *         description: The customer type was not found
 */
router.delete('/:id', deleteCustomerType);

export default router;

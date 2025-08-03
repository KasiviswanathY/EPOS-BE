import express from 'express';
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from '../controllers/roleController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Staff Roles
 *   description: Staff Role management endpoints
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Staff Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRole'
 *     responses:
 *       201:
 *         description: The role was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       500:
 *         description: Some server error
 */
router.post('/', createRole);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Returns the list of all roles
 *     tags: [Staff Roles]
 *     responses:
 *       200:
 *         description: The list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get('/', getRoles);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get the role by id
 *     tags: [Staff Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: The role description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: The role was not found
 */
router.get('/:id', getRoleById);

/**
 * @swagger
 * /roles/{id}:
 *   patch:
 *     summary: Update the role by the id
 *     tags: [Staff Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRole'
 *     responses:
 *       200:
 *         description: The role was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: The role was not found
 *       500:
 *         description: Some error happened
 */
router.patch('/:id', updateRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Remove the role by id
 *     tags: [Staff Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: The role was deleted
 *       404:
 *         description: The role was not found
 */
router.delete('/:id', deleteRole);

export default router;

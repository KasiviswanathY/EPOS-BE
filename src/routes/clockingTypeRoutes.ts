import express from 'express';
import {
  createClockingType,
  getClockingTypes,
  getClockingTypeById,
  updateClockingType,
  deleteClockingType,
} from '../controllers/clockingTypeController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clocking Types
 *   description: The clocking types managing API
 */

/**
 * @swagger
 * /clocking-types:
 *   post:
 *     summary: Create a new clocking type
 *     tags: [Clocking Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - payMultiplier
 *            properties:
 *              name:
 *                type: string
 *              payMultiplier:
 *                type: number
 *     responses:
 *       201:
 *         description: The clocking type was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClockingType'
 *       500:
 *         description: Some server error
 */
router.post('/', createClockingType);

/**
 * @swagger
 * /clocking-types:
 *   get:
 *     summary: Returns the list of all clocking types
 *     tags: [Clocking Types]
 *     responses:
 *       200:
 *         description: The list of clocking types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClockingType'
 */
router.get('/', getClockingTypes);

/**
 * @swagger
 * /clocking-types/{id}:
 *   get:
 *     summary: Get the clocking type by id
 *     tags: [Clocking Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clocking type id
 *     responses:
 *       200:
 *         description: The clocking type description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClockingType'
 *       404:
 *         description: The clocking type was not found
 */
router.get('/:id', getClockingTypeById);

/**
 * @swagger
 * /clocking-types/{id}:
 *   put:
 *     summary: Update the clocking type by the id
 *     tags: [Clocking Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clocking type id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - payMultiplier
 *            properties:
 *              name:
 *                type: string
 *              payMultiplier:
 *                type: number
 *     responses:
 *       200:
 *         description: The clocking type was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClockingType'
 *       404:
 *         description: The clocking type was not found
 *       500:
 *         description: Some error happened
 */
router.patch('/:id', updateClockingType);

/**
 * @swagger
 * /clocking-types/{id}:
 *   delete:
 *     summary: Remove the clocking type by id
 *     tags: [Clocking Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clocking type id
 *     responses:
 *       200:
 *         description: The clocking type was deleted
 *       404:
 *         description: The clocking type was not found
 */
router.delete('/:id', deleteClockingType);

export default router;

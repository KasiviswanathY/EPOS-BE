import express from 'express';
import {
  createOpeningHours,
  getOpeningHours,
  getOpeningHoursById,
  updateOpeningHours,
  deleteOpeningHours,
} from '../controllers/openingHoursController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Opening Hours
 *   description: The opening hours managing API
 */

/**
 * @swagger
 * /opening-hours:
 *   post:
 *     summary: Create a new opening hours
 *     tags: [Opening Hours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOpeningHours'
 *     responses:
 *       201:
 *         description: The opening hours was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpeningHours'
 *       500:
 *         description: Some server error
 */
router.post('/', createOpeningHours);

/**
 * @swagger
 * /opening-hours:
 *   get:
 *     summary: Returns the list of all opening hours
 *     tags: [Opening Hours]
 *     responses:
 *       200:
 *         description: The list of opening hours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 */
router.get('/', getOpeningHours);

/**
 * @swagger
 * /opening-hours/{id}:
 *   get:
 *     summary: Get the opening hours by id
 *     tags: [Opening Hours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The opening hours id
 *     responses:
 *       200:
 *         description: The opening hours description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpeningHours'
 *       404:
 *         description: The opening hours was not found
 */
router.get('/:id', getOpeningHoursById);

/**
 * @swagger
 * /opening-hours/{id}:
 *   put:
 *     summary: Update the opening hours by the id
 *     tags: [Opening Hours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The opening hours id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOpeningHours'
 *     responses:
 *       200:
 *         description: The opening hours was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpeningHours'
 *       404:
 *         description: The opening hours was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', updateOpeningHours);

/**
 * @swagger
 * /opening-hours/{id}:
 *   delete:
 *     summary: Remove the opening hours by id
 *     tags: [Opening Hours]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The opening hours id
 *     responses:
 *       200:
 *         description: The opening hours was deleted
 *       404:
 *         description: The opening hours was not found
 */
router.delete('/:id', deleteOpeningHours);

export default router;

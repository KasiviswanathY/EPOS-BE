import express from 'express';
import {
  createDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
} from '../controllers/devicesController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: The devices managing API
 */

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDevice'
 *     responses:
 *       201:
 *         description: The device was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Devices'
 *       500:
 *         description: Some server error
 */
router.post('/', createDevice);

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Returns the list of all devices
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: The list of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Devices'
 */
router.get('/', getDevices);

/**
 * @swagger
 * /devices/{id}:
 *   get:
 *     summary: Get the device by id
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The device id
 *     responses:
 *       200:
 *         description: The device description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Devices'
 *       404:
 *         description: The device was not found
 */
router.get('/:id', getDeviceById);

/**
 * @swagger
 * /devices/{id}:
 *   put:
 *     summary: Update the device by the id
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The device id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDevice'
 *     responses:
 *       200:
 *         description: The device was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Devices'
 *       404:
 *         description: The device was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', updateDevice);

/**
 * @swagger
 * /devices/{id}:
 *   delete:
 *     summary: Remove the device by id
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The device id
 *     responses:
 *       200:
 *         description: The device was deleted
 *       404:
 *         description: The device was not found
 */
router.delete('/:id', deleteDevice);

export default router;

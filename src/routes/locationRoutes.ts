import { Router } from 'express';
import {
  createLocation,
  getLocationById,
  getLocations,
  getLocationsByCompanyId,
  updateLocation,
  deleteLocation,
} from '../controllers/locationController';

const router = Router();

/**
 * @openapi
 * /locations:
 *   post:
 *     summary: Create a new location
 *     tags:
 *       - Locations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - companyId
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               pincode:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 default: ACTIVE
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               language:
 *                 type: string
 *                 default: en
 *               timeZone:
 *                 type: string
 *                 default: UTC
 *               companyId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/', createLocation);

/**
 * @openapi
 * /locations:
 *   get:
 *     summary: Get all locations
 *     tags:
 *       - Locations
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getLocations);

/**
 * @openapi
 * /locations/{id}:
 *   get:
 *     summary: Get location by ID
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getLocationById);

/**
 * @openapi
 * /locations/company/{companyId}:
 *   get:
 *     summary: Get all locations by company ID
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of locations for a company
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       404:
 *         description: No locations found for this company
 *       500:
 *         description: Internal Server Error
 */
router.get('/company/:companyId', getLocationsByCompanyId);

/**
 * @openapi
 * /locations/{id}:
 *   patch:
 *     summary: Update a location
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               pincode:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               language:
 *                 type: string
 *               timeZone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', updateLocation);

/**
 * @openapi
 * /locations/{id}:
 *   delete:
 *     summary: Delete a location
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteLocation);

export default router;

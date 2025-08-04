import { Router } from 'express';
import {
  getStaffHours,
  getStaffHoursById,
  createStaffHours,
  updateStaffHours,
  deleteStaffHours,
} from '../controllers/staffHoursController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Staff Hours
 *     description: Staff hours management endpoints
 */

/**
 * @openapi
 * /staff-hours/create:
 *   post:
 *     summary: Create staff hours
 *     tags: [Staff Hours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStaffHours'
 *     responses:
 *       201:
 *         description: Staff hours created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/create', createStaffHours);

/**
 * @openapi
 * /staff-hours:
 *   get:
 *     summary: Get all staff hours
 *     tags: [Staff Hours]
 *     responses:
 *       200:
 *         description: List of staff hours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffHours'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getStaffHours);

/**
 * @openapi
 * /staff-hours/{id}:
 *   get:
 *     summary: Get staff hours by ID
 *     tags: [Staff Hours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff hours found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffHours'
 *       404:
 *         description: Staff hours not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getStaffHoursById);

/**
 * @openapi
 * /staff-hours/{id}:
 *   patch:
 *     summary: Update staff hours
 *     tags: [Staff Hours]
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
 *             $ref: '#/components/schemas/UpdateStaffHours'
 *     responses:
 *       200:
 *         description: Staff hours updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffHours'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Staff hours not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', updateStaffHours);

/**
 * @openapi
 * /staff-hours/{id}:
 *   delete:
 *     summary: Delete staff hours
 *     tags: [Staff Hours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff hours deleted successfully
 *       404:
 *         description: Staff hours not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteStaffHours);

export default router;

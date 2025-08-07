import { Router } from 'express';
import {
  getPopupNotes,
  getPopupNoteById,
  createPopupNote,
  updatePopupNote,
  deletePopupNote,
} from '../controllers/popupNoteController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: PopupNote
 *     description: Popup note management endpoints
 */

/**
 * @openapi
 * /popup-notes:
 *   get:
 *     summary: Get all popup notes with pagination
 *     tags:
 *       - PopupNote
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
 *         description: List of popup notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PopupNote'
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
router.get('/', getPopupNotes);

/**
 * @openapi
 * /popup-notes/{id}:
 *   get:
 *     summary: Get a popup note by ID
 *     tags:
 *       - PopupNote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: PopupNote ID
 *     responses:
 *       200:
 *         description: Popup note details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PopupNote'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: PopupNote not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getPopupNoteById);

/**
 * @openapi
 * /popup-notes:
 *   post:
 *     summary: Create a new popup note
 *     tags:
 *       - PopupNote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePopupNote'
 *     responses:
 *       201:
 *         description: Popup note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PopupNote'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/', createPopupNote);

/**
 * @openapi
 * /popup-notes/{id}:
 *   patch:
 *     summary: Update a popup note
 *     tags:
 *       - PopupNote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: PopupNote ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePopupNote'
 *     responses:
 *       200:
 *         description: Popup note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PopupNote'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: PopupNote not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', updatePopupNote);

/**
 * @openapi
 * /popup-notes/{id}:
 *   delete:
 *     summary: Delete a popup note
 *     tags:
 *       - PopupNote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: PopupNote ID
 *     responses:
 *       200:
 *         description: Popup note deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: PopupNote not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deletePopupNote);

export default router;

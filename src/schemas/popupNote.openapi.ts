/**
 * @openapi
 * components:
 *   schemas:
 *     PopupNote:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the popup note
 *         name:
 *           type: string
 *           description: The name of the popup note
 *         message:
 *           type: string
 *           description: The message content of the popup note
 *         showOncePerTransaction:
 *           type: boolean
 *           description: Whether the popup note should only show once per transaction
 *         category:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *           description: Categories associated with this popup note
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 *     CreatePopupNote:
 *       type: object
 *       required:
 *         - name
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the popup note
 *         message:
 *           type: string
 *           description: The message content of the popup note
 *         showOncePerTransaction:
 *           type: boolean
 *           description: Whether the popup note should only show once per transaction
 *     UpdatePopupNote:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the popup note
 *         message:
 *           type: string
 *           description: The message content of the popup note
 *         showOncePerTransaction:
 *           type: boolean
 *           description: Whether the popup note should only show once per transaction
 */

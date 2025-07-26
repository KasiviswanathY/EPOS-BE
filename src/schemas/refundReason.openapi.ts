/**
 * @openapi
 * components:
 *   schemas:
 *     RefundReason:
 *       type: object
 *       required:
 *         - description
 *         - shortDescription
 *       properties:
 *         id:
 *           type: string
 *         description:
 *           type: string
 *         shortDescription:
 *           type: string
 *         returnToStock:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

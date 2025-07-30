/**
 * @openapi
 * components:
 *   schemas:
 *     OpeningHours:
 *       type: object
 *       required:
 *         - day
 *         - openTime
 *         - closeTime
 *         - locationId
 *       properties:
 *         id:
 *           type: string
 *         day:
 *           type: string
 *         openTime:
 *           type: string
 *         closeTime:
 *           type: string
 *         locationId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateOpeningHours:
 *       type: object
 *       required:
 *         - day
 *         - openTime
 *         - closeTime
 *         - locationId
 *       properties:
 *         day:
 *           type: string
 *         openTime:
 *           type: string
 *         closeTime:
 *           type: string
 *         locationId:
 *           type: string
 */

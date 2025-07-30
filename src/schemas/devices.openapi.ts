/**
 * @openapi
 * components:
 *   schemas:
 *     Devices:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - locationId
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *         locationId:
 *           type: string
 *         enabled:
 *           type: boolean
 *           default: true
 *         priceMode:
 *           type: string
 *         autoClose:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateDevice:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - locationId
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *         locationId:
 *           type: string
 *         enabled:
 *           type: boolean
 *           default: true
 *         priceMode:
 *           type: string
 *         autoClose:
 *           type: boolean
 *           default: false
 */

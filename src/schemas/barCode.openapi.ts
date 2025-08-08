/**
 * @openapi
 * components:
 *   schemas:
 *     BarCode:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the barcode
 *         code:
 *           type: string
 *           description: The actual barcode value
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateBarCode:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 */

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
 *         productId:
 *           type: string
 *           description: Unique identifier for the associated product
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
 *         - productId
 *       properties:
 *         code:
 *           type: string
 *         productId:
 *           type: string
 */

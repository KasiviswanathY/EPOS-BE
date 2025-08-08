/**
 * @openapi
 * components:
 *   schemas:
 *     ProductTag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the product tag
 *         name:
 *           type: string
 *           description: Name of the product tag
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateProductTag:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 */

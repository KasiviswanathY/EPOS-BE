/**
 * @openapi
 * components:
 *   schemas:
 *     TaxRate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the tax rate
 *         name:
 *           type: string
 *           description: Name of the tax rate
 *         percentage:
 *           type: number
 *           format: float
 *           description: Tax rate percentage
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateTaxRate:
 *       type: object
 *       required:
 *         - name
 *         - percentage
 *       properties:
 *         name:
 *           type: string
 *         percentage:
 *           type: number
 *           format: float
 */

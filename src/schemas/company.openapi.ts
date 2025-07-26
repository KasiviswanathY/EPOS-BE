/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         website:
 *           type: string
 *         displayName:
 *           type: string
 *         description:
 *           type: string
 *         taxNumber:
 *           type: string
 *         customCurrency:
 *           type: string
 *         language:
 *           type: string
 *           default: en
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         Location:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Location'
 *         CompanyReceipt:
 *           $ref: '#/components/schemas/CompanyReceipt'
 */

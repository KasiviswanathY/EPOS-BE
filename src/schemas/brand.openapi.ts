/**
 * @openapi
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the brand
 *         name:
 *           type: string
 *           description: Name of the brand
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description of the brand
 *         status:
 *           type: string
 *           description: Current status of the brand
 *         productOrderCode:
 *           type: string
 *           nullable: true
 *           description: Product order code for the brand
 *         articleCode:
 *           type: string
 *           nullable: true
 *           description: Article code for the brand
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateBrand:
 *       type: object
 *       required:
 *         - name
 *         - status
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         productOrderCode:
 *           type: string
 *         articleCode:
 *           type: string
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ContainerFee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the container fee
 *         name:
 *           type: string
 *           description: Name of the container fee
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description of the container fee
 *         fee:
 *           type: number
 *           format: float
 *           description: The fee amount
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateContainerFee:
 *       type: object
 *       required:
 *         - name
 *         - fee
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         fee:
 *           type: number
 *           format: float
 */

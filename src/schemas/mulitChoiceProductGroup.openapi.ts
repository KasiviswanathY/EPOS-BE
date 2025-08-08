/**
 * @openapi
 * components:
 *   schemas:
 *     MulitChoiceProductGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the multi-choice product group
 *         name:
 *           type: string
 *           description: Name of the multi-choice product group
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description of the group
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateMulitChoiceProductGroup:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

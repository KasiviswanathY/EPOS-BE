/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description of the category
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the parent category if this is a subcategory
 *         reportCategory:
 *           type: string
 *           nullable: true
 *           description: Category used for reporting purposes
 *         wetOrDry:
 *           type: string
 *           enum: [WET, DRY]
 *           default: WET
 *           description: Whether this is a wet or dry category
 *         showonTill:
 *           type: boolean
 *           default: true
 *           description: Whether to show this category on the till
 *         nominalCode:
 *           type: string
 *           nullable: true
 *           description: Nominal code for accounting purposes
 *         popupNoteId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the associated popup note
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 */

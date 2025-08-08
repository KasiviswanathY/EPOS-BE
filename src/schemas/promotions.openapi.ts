/**
 * @openapi
 * components:
 *   schemas:
 *     Promotions:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the promotion
 *         name:
 *           type: string
 *           description: Name of the promotion
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description of the promotion
 *         duration:
 *           type: string
 *           enum: [BETWEEN_DATES, BETWEEN_TIMES]
 *           default: BETWEEN_DATES
 *           description: Duration type of the promotion
 *         fromDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         toDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         timeFrom:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         timeTo:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         mealDeal:
 *           type: boolean
 *           default: false
 *         noOfMealDealGroups:
 *           type: integer
 *           default: 1
 *         type:
 *           type: string
 *           enum: [X_FOR_Y, X_FOR_DOLLAR, PERCENTAGE_DISCOUNT, SPEND_DOLLAR_SAVE_PERCENTAGE, SPEND_DOLLAR_SAVE_DOLLAR]
 *         requiredQuantity:
 *           type: number
 *           format: float
 *           default: 1.0
 *         discountAmount:
 *           type: number
 *           format: float
 *           default: 0.0
 *         mixAndMatch:
 *           type: boolean
 *           default: false
 *         usedWithOtherPromotions:
 *           type: boolean
 *           default: false
 *         enabled:
 *           type: boolean
 *           default: true
 *         daysEnabled:
 *           type: array
 *           items:
 *             type: string
 *             enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *           default: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *         customerTypeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreatePromotions:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         duration:
 *           type: string
 *           enum: [BETWEEN_DATES, BETWEEN_TIMES]
 *         fromDate:
 *           type: string
 *           format: date-time
 *         toDate:
 *           type: string
 *           format: date-time
 *         timeFrom:
 *           type: string
 *           format: date-time
 *         timeTo:
 *           type: string
 *           format: date-time
 *         mealDeal:
 *           type: boolean
 *         noOfMealDealGroups:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [X_FOR_Y, X_FOR_DOLLAR, PERCENTAGE_DISCOUNT, SPEND_DOLLAR_SAVE_PERCENTAGE, SPEND_DOLLAR_SAVE_DOLLAR]
 *         requiredQuantity:
 *           type: number
 *           format: float
 *         discountAmount:
 *           type: number
 *           format: float
 *         mixAndMatch:
 *           type: boolean
 *         usedWithOtherPromotions:
 *           type: boolean
 *         enabled:
 *           type: boolean
 *         daysEnabled:
 *           type: array
 *           items:
 *             type: string
 *             enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *         customerTypeId:
 *           type: string
 *           format: uuid
 */

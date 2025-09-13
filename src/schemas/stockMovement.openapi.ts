/**
 * @openapi
 * components:
 *   schemas:
 *     StockMovement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the stock movement
 *         type:
 *           type: string
 *           enum: [INITIAL_STOCK, PURCHASE, SALE, ADJUSTMENT, RETURN, TRANSFER_IN, TRANSFER_OUT, DAMAGED, EXPIRED]
 *           description: Type of stock movement
 *         quantity:
 *           type: integer
 *           description: Quantity moved (positive or negative)
 *         previousQuantity:
 *           type: integer
 *           description: Stock quantity before movement
 *         newQuantity:
 *           type: integer
 *           description: Stock quantity after movement
 *         reason:
 *           type: string
 *           nullable: true
 *           description: Reason for stock movement
 *         reference:
 *           type: string
 *           nullable: true
 *           description: Reference number (order ID, transfer ID, etc.)
 *         stockId:
 *           type: string
 *           format: uuid
 *           description: Stock record ID
 *         processedByStaffId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Staff member who processed the movement (optional)
 *         processedByUserId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: User who processed the movement (optional)
 *         stock:
 *           $ref: '#/components/schemas/Stock'
 *         processedByStaff:
 *           $ref: '#/components/schemas/Staff'
 *         processedByUser:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateStockMovement:
 *       type: object
 *       required:
 *         - type
 *         - quantity
 *         - stockId
 *       properties:
 *         type:
 *           type: string
 *           enum: [INITIAL_STOCK, PURCHASE, SALE, ADJUSTMENT, RETURN, TRANSFER_IN, TRANSFER_OUT, DAMAGED, EXPIRED]
 *           description: Type of stock movement
 *         quantity:
 *           type: integer
 *           description: Quantity to move (positive or negative based on movement type)
 *         reason:
 *           type: string
 *           description: Reason for stock movement
 *         reference:
 *           type: string
 *           description: Reference number (order ID, transfer ID, etc.)
 *         stockId:
 *           type: string
 *           format: uuid
 *           description: Stock record ID
 *         processedByStaffId:
 *           type: string
 *           format: uuid
 *           description: Staff member who processed the movement (optional)
 *         processedByUserId:
 *           type: string
 *           format: uuid
 *           description: User who processed the movement (optional)
 *     BulkCreateStockMovement:
 *       type: object
 *       required:
 *         - movements
 *       properties:
 *         movements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateStockMovement'
 *           description: Array of stock movements to create in bulk
 *     UpdateStockMovement:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [INITIAL_STOCK, PURCHASE, SALE, ADJUSTMENT, RETURN, TRANSFER_IN, TRANSFER_OUT, DAMAGED, EXPIRED]
 *           description: Type of stock movement
 *         quantity:
 *           type: integer
 *           description: Quantity to move
 *         reason:
 *           type: string
 *           description: Reason for stock movement
 *         reference:
 *           type: string
 *           description: Reference number (order ID, transfer ID, etc.)
 *         processedByStaffId:
 *           type: string
 *           format: uuid
 *           description: Staff member who processed the movement
 *         processedByUserId:
 *           type: string
 *           format: uuid
 *           description: User who processed the movement
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     Stock:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the stock record
 *         quantity:
 *           type: integer
 *           description: Current stock quantity
 *         minStockLevel:
 *           type: integer
 *           nullable: true
 *           description: Minimum stock level for alerts
 *         maxStockLevel:
 *           type: integer
 *           nullable: true
 *           description: Maximum stock level
 *         reorderLevel:
 *           type: integer
 *           nullable: true
 *           description: Stock level at which to reorder
 *         lastRestockDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Last date when stock was restocked
 *         isLowStock:
 *           type: boolean
 *           description: Whether stock is below minimum level
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         locationId:
 *           type: string
 *           format: uuid
 *           description: Location ID
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         stockMovements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StockMovement'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
 *     CreateStock:
 *       type: object
 *       required:
 *         - productId
 *         - locationId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         locationId:
 *           type: string
 *           format: uuid
 *           description: Location ID
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           description: Initial stock quantity
 *         minStockLevel:
 *           type: integer
 *           minimum: 0
 *           description: Minimum stock level for alerts
 *         maxStockLevel:
 *           type: integer
 *           minimum: 0
 *           description: Maximum stock level
 *         reorderLevel:
 *           type: integer
 *           minimum: 0
 *           description: Stock level at which to reorder
 *     UpdateStock:
 *       type: object
 *       properties:
 *         minStockLevel:
 *           type: integer
 *           minimum: 0
 *           description: Minimum stock level for alerts
 *         maxStockLevel:
 *           type: integer
 *           minimum: 0
 *           description: Maximum stock level
 *         reorderLevel:
 *           type: integer
 *           minimum: 0
 *           description: Stock level at which to reorder
 *     StockAdjustment:
 *       type: object
 *       required:
 *         - type
 *         - quantity
 *       properties:
 *         type:
 *           type: string
 *           enum: [PURCHASE, ADJUSTMENT, RETURN, TRANSFER_IN, TRANSFER_OUT, DAMAGED, EXPIRED]
 *           description: Type of stock adjustment
 *         quantity:
 *           type: integer
 *           description: Quantity to adjust (positive for increase, negative for decrease)
 *         reason:
 *           type: string
 *           description: Reason for stock adjustment
 *         reference:
 *           type: string
 *           description: Reference number (order ID, transfer ID, etc.)
 */

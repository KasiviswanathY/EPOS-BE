/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the order
 *         orderNumber:
 *           type: string
 *           description: Unique order number
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED, REFUNDED]
 *           description: Current status of the order
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was placed
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: Total amount before tax and discount
 *         subTotal:
 *           type: number
 *           format: float
 *           description: Subtotal amount
 *         taxAmount:
 *           type: number
 *           format: float
 *           description: Total tax amount
 *         discountAmount:
 *           type: number
 *           format: float
 *           description: Total discount amount
 *         finalAmount:
 *           type: number
 *           format: float
 *           description: Final amount after tax and discount
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, CARD, CREDIT, BANK_TRANSFER, MOBILE_PAYMENT]
 *           description: Payment method used
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, PAID, PARTIAL, FAILED, REFUNDED]
 *           description: Payment status
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Additional notes for the order
 *         customerId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Customer ID (optional for walk-in customers)
 *         locationId:
 *           type: string
 *           format: uuid
 *           description: Location where order was placed
 *         processedByStaffId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Staff member who processed the order (optional)
 *         processedByUserId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: User who processed the order (optional)
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         processedByStaff:
 *           $ref: '#/components/schemas/Staff'
 *         processedByUser:
 *           $ref: '#/components/schemas/User'
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the order item
 *         quantity:
 *           type: integer
 *           description: Quantity of the product
 *         unitPrice:
 *           type: number
 *           format: float
 *           description: Unit price of the product
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Total price (quantity * unitPrice)
 *         discountAmount:
 *           type: number
 *           format: float
 *           description: Discount amount applied to this item
 *         taxAmount:
 *           type: number
 *           format: float
 *           description: Tax amount for this item
 *         finalAmount:
 *           type: number
 *           format: float
 *           description: Final amount after discount and tax
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Order ID
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         order:
 *           $ref: '#/components/schemas/Order'
 *         promotions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Promotions'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateOrder:
 *       type: object
 *       required:
 *         - totalAmount
 *         - subTotal
 *         - taxAmount
 *         - finalAmount
 *         - paymentMethod
 *         - locationId
 *         - processedByStaffId
 *         - orderItems
 *       properties:
 *         totalAmount:
 *           type: number
 *           format: float
 *         subTotal:
 *           type: number
 *           format: float
 *         taxAmount:
 *           type: number
 *           format: float
 *         discountAmount:
 *           type: number
 *           format: float
 *           default: 0.0
 *         finalAmount:
 *           type: number
 *           format: float
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, CARD, CREDIT, BANK_TRANSFER, MOBILE_PAYMENT]
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, PAID, PARTIAL, FAILED, REFUNDED]
 *           default: PENDING
 *         notes:
 *           type: string
 *         customerId:
 *           type: string
 *           format: uuid
 *         locationId:
 *           type: string
 *           format: uuid
 *         processedByStaffId:
 *           type: string
 *           format: uuid
 *           description: Staff member who processed the order
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateOrderItem'
 *     CreateOrderItem:
 *       type: object
 *       required:
 *         - quantity
 *         - unitPrice
 *         - totalPrice
 *         - finalAmount
 *         - productId
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         unitPrice:
 *           type: number
 *           format: float
 *         totalPrice:
 *           type: number
 *           format: float
 *         discountAmount:
 *           type: number
 *           format: float
 *           default: 0.0
 *         taxAmount:
 *           type: number
 *           format: float
 *           default: 0.0
 *         finalAmount:
 *           type: number
 *           format: float
 *         productId:
 *           type: string
 *           format: uuid
 *     UpdateOrder:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED, REFUNDED]
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, PAID, PARTIAL, FAILED, REFUNDED]
 *         notes:
 *           type: string
 */

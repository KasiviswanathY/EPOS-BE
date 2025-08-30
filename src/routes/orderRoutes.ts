import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: Order management endpoints
 */

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Get all orders with pagination and filtering
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED, REFUNDED]
 *         description: Filter by order status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, PARTIAL, FAILED, REFUNDED]
 *         description: Filter by payment status
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by customer ID
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by location ID
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', getOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getOrderById);

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalAmount
 *               - subTotal
 *               - taxAmount
 *               - finalAmount
 *               - paymentMethod
 *               - locationId
 *               - processedById
 *               - orderItems
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 description: Total amount before tax and discount
 *               subTotal:
 *                 type: number
 *                 format: float
 *                 description: Subtotal amount
 *               taxAmount:
 *                 type: number
 *                 format: float
 *                 description: Total tax amount
 *               discountAmount:
 *                 type: number
 *                 format: float
 *                 default: 0.0
 *                 description: Total discount amount
 *               finalAmount:
 *                 type: number
 *                 format: float
 *                 description: Final amount after tax and discount
 *               paymentMethod:
 *                 type: string
 *                 enum: [CASH, CARD, CREDIT, BANK_TRANSFER, MOBILE_PAYMENT]
 *                 description: Payment method used
 *               paymentStatus:
 *                 type: string
 *                 enum: [PENDING, PAID, PARTIAL, FAILED, REFUNDED]
 *                 default: PENDING
 *                 description: Payment status
 *               notes:
 *                 type: string
 *                 description: Additional notes for the order
 *               customerId:
 *                 type: string
 *                 format: uuid
 *                 description: Customer ID (optional for walk-in customers)
 *               locationId:
 *                 type: string
 *                 format: uuid
 *                 description: Location where order was placed
 *               processedById:
 *                 type: string
 *                 format: uuid
 *                 description: Staff member who processed the order
 *               orderItems:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - quantity
 *                     - unitPrice
 *                     - totalPrice
 *                     - finalAmount
 *                     - productId
 *                   properties:
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Quantity of the product
 *                     unitPrice:
 *                       type: number
 *                       format: float
 *                       description: Unit price of the product
 *                     totalPrice:
 *                       type: number
 *                       format: float
 *                       description: Total price (quantity * unitPrice)
 *                     discountAmount:
 *                       type: number
 *                       format: float
 *                       default: 0.0
 *                       description: Discount amount applied to this item
 *                     taxAmount:
 *                       type: number
 *                       format: float
 *                       default: 0.0
 *                       description: Tax amount for this item
 *                     finalAmount:
 *                       type: number
 *                       format: float
 *                       description: Final amount after discount and tax
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                       description: Product ID
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Location, staff, customer, or product not found
 *       500:
 *         description: Internal server error
 */
router.post('/', createOrder);

/**
 * @openapi
 * /orders/{id}:
 *   patch:
 *     summary: Update an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED, REFUNDED]
 *                 description: Order status
 *               paymentStatus:
 *                 type: string
 *                 enum: [PENDING, PAID, PARTIAL, FAILED, REFUNDED]
 *                 description: Payment status
 *               notes:
 *                 type: string
 *                 description: Additional notes for the order
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateOrder);

/**
 * @openapi
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       400:
 *         description: Cannot delete completed or paid orders
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteOrder);

export default router;

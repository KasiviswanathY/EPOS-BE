/**
 * @openapi
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - permissions
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - BACK_OFFICE
 *               - TILL
 *               - ADMIN_ACCESS_ON_TILL
 *               - TILL_SETTINGS
 *               - QUICK_ADD_SETTINGS
 *               - CLOCK_IN_CLOCK_OUT_INFO
 *               - MANAGER_OVERRIDE
 *               - NO_SALES
 *               - PETTY_CASH
 *               - FLOAT_ADJUSTMENT
 *               - STOCK_SEND
 *               - STOCK_RECEIVE
 *               - STOCK_TAKE
 *               - PAYOUTS
 *               - HOLD
 *               - CLOSE_TILL
 *               - BLIND_END_OF_DAY
 *               - VOID_ANY_ITEM
 *               - DELETE_UNORDERED_ITEMS
 *               - CLEAR_TRANSACTION
 *               - REMOVE_FROM_TABLE
 *               - ITEM_DISCOUNT
 *               - ITEM_DISCOUNT_LIMIT
 *               - ITEM_DISCOUNT_LIMIT_PERCENTAGE
 *               - BASKET_DISCOUNT
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateRole:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - permissions
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - BACK_OFFICE
 *               - TILL
 *               - ADMIN_ACCESS_ON_TILL
 *               - TILL_SETTINGS
 *               - QUICK_ADD_SETTINGS
 *               - CLOCK_IN_CLOCK_OUT_INFO
 *               - MANAGER_OVERRIDE
 *               - NO_SALES
 *               - PETTY_CASH
 *               - FLOAT_ADJUSTMENT
 *               - STOCK_SEND
 *               - STOCK_RECEIVE
 *               - STOCK_TAKE
 *               - PAYOUTS
 *               - HOLD
 *               - CLOSE_TILL
 *               - BLIND_END_OF_DAY
 *               - VOID_ANY_ITEM
 *               - DELETE_UNORDERED_ITEMS
 *               - CLEAR_TRANSACTION
 *               - REMOVE_FROM_TABLE
 *               - ITEM_DISCOUNT
 *               - ITEM_DISCOUNT_LIMIT
 *               - ITEM_DISCOUNT_LIMIT_PERCENTAGE
 *               - BASKET_DISCOUNT
 */

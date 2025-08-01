/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - status
 *         - permissions
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *             - SUSPENDED
 *           example: ACTIVE
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - USER_RIGHTS
 *               - PRODUCT_RIGHTS
 *               - PURCHASE_ORDER_RIGHTS
 *               - CREATE_PURCHASE_ORDER
 *               - VIEW_PURCHASE_ORDER
 *               - UPDATE_PURCHASE_ORDER
 *               - CANCEL_PURCHASE_ORDER
 *               - SETUP_RIGHTS
 *               - MANAGEMENT_RIGHTS
 *               - REPORTING_RIGHTS
 *               - MARGIN_RIGHTS
 *               - TILL_RIGHTS
 *               - WEB_INTEGRATION_RIGHTS
 *               - APPS_RIGHTS
 *           example: ["USER_RIGHTS", "PRODUCT_RIGHTS"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - status
 *         - permissions
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *             - SUSPENDED
 *           example: ACTIVE
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - USER_RIGHTS
 *               - PRODUCT_RIGHTS
 *               - PURCHASE_ORDER_RIGHTS
 *               - CREATE_PURCHASE_ORDER
 *               - VIEW_PURCHASE_ORDER
 *               - UPDATE_PURCHASE_ORDER
 *               - CANCEL_PURCHASE_ORDER
 *               - SETUP_RIGHTS
 *               - MANAGEMENT_RIGHTS
 *               - REPORTING_RIGHTS
 *               - MARGIN_RIGHTS
 *               - TILL_RIGHTS
 *               - WEB_INTEGRATION_RIGHTS
 *               - APPS_RIGHTS
 *           example: ["USER_RIGHTS", "PRODUCT_RIGHTS"]
 *     UpdateUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - status
 *         - permissions
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *             - SUSPENDED
 *           example: ACTIVE
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - USER_RIGHTS
 *               - PRODUCT_RIGHTS
 *               - PURCHASE_ORDER_RIGHTS
 *               - CREATE_PURCHASE_ORDER
 *               - VIEW_PURCHASE_ORDER
 *               - UPDATE_PURCHASE_ORDER
 *               - CANCEL_PURCHASE_ORDER
 *               - SETUP_RIGHTS
 *               - MANAGEMENT_RIGHTS
 *               - REPORTING_RIGHTS
 *               - MARGIN_RIGHTS
 *               - TILL_RIGHTS
 *               - WEB_INTEGRATION_RIGHTS
 *               - APPS_RIGHTS
 *           example: ["USER_RIGHTS", "PRODUCT_RIGHTS"]
 */

/**
 * @openapi
 * tags:
 *   - name: StaffHours
 *     description: Staff hours management endpoints
 * components:
 *   schemas:
 *     StaffHours:
 *       type: object
 *       required:
 *         - staffId
 *         - date
 *         - clockingTypeId
 *         - locationId
 *       properties:
 *         id:
 *           type: string
 *         staffId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         clockingIn:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         clockingOut:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *         clockingTypeId:
 *           type: string
 *         locationId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateStaffHours:
 *       type: object
 *       required:
 *         - staffId
 *         - date
 *         - clockingTypeId
 *         - locationId
 *       properties:
 *         staffId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         clockingIn:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         clockingOut:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *         clockingTypeId:
 *           type: string
 *         locationId:
 *           type: string
 *     UpdateStaffHours:
 *       type: object
 *       required:
 *         - staffId
 *         - date
 *         - clockingTypeId
 *         - locationId
 *       properties:
 *         staffId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         clockingIn:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         clockingOut:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *         clockingTypeId:
 *           type: string
 *         locationId:
 *           type: string
 */

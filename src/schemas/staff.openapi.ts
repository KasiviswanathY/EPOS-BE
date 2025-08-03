/**
 * @openapi
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       required:
 *         - name
 *         - status
 *         - availableForAllLocations
 *         - roleId
 *         - mainLocationId
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *             - SUSPENDED
 *         availableForAllLocations:
 *           type: boolean
 *           default: false
 *         passcode:
 *           type: string
 *           nullable: true
 *         swipeLogin:
 *           type: string
 *           nullable: true
 *         hourlyRate:
 *           type: number
 *           nullable: true
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         roleId:
 *           type: string
 *         mainLocationId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         role:
 *           $ref: '#/components/schemas/Role'
 *         mainLocation:
 *           $ref: '#/components/schemas/Location'
 *         StaffHours:
 *           $ref: '#/components/schemas/StaffHours'
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
 *     CreateStaff:
 *       type: object
 *       required:
 *         - name
 *         - status
 *         - availableForAllLocations
 *         - roleId
 *         - mainLocationId
 *       properties:
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *             - SUSPENDED
 *         availableForAllLocations:
 *           type: boolean
 *           default: false
 *         passcode:
 *           type: string
 *           nullable: true
 *         swipeLogin:
 *           type: string
 *           nullable: true
 *         hourlyRate:
 *           type: number
 *           nullable: true
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         roleId:
 *           type: string
 *         mainLocationId:
 *           type: string
 *     UpdateStaff:
 *       type: object
 *       required:
 *         - name
 *         - status
 *         - availableForAllLocations
 *         - roleId
 *         - mainLocationId
 *       properties:
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *             - SUSPENDED
 *         availableForAllLocations:
 *           type: boolean
 *           default: false
 *         passcode:
 *           type: string
 *           nullable: true
 *         swipeLogin:
 *           type: string
 *           nullable: true
 *         hourlyRate:
 *           type: number
 *           nullable: true
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         roleId:
 *           type: string
 *         mainLocationId:
 *           type: string
 */

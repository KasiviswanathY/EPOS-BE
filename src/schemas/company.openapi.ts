/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         taxNumber:
 *           type: string
 *         customCurrency:
 *           type: string
 *         language:
 *           type: string
 *           default: en
 *         updateCostPriceOnMasterUpdate:
 *           type: boolean
 *           default: false
 *         explicitConsent:
 *           type: boolean
 *           default: false
 *         eraseCustomerData:
 *           type: boolean
 *           default: false
 *         runReportsOnPageLoad:
 *           type: boolean
 *           default: false
 *         showIncExTaxOption:
 *           type: boolean
 *           default: false
 *         maxNoOfDevices:
 *           type: integer
 *           default: 1
 *         maxNoOfLocations:
 *           type: integer
 *           default: 1
 *         showInstructionsOnStartup:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         Location:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Location'
 *         CompanyReceipt:
 *           $ref: '#/components/schemas/CompanyReceipt'
 */

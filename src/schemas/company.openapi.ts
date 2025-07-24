/**
 * @openapi
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         website:
 *           type: string
 *         displayName:
 *           type: string
 *         description:
 *           type: string
 *         taxNumber:
 *           type: string
 *         customCurrency:
 *           type: string
 *         language:
 *           type: string
 *           default: en
 *         barCodeType:
 *           type: string
 *           default: CODE128
 *         qrCodeLink:
 *           type: string
 *           default: https://example.com/qr-code
 *         qrCodeDescription:
 *           type: string
 *           default: Scan this QR code for more information
 *         refundDays:
 *           type: integer
 *           default: 7
 *         showTaxBreakdown:
 *           type: boolean
 *           default: false
 *         showCustomerBalance:
 *           type: boolean
 *           default: false
 *         printCustomerAddress:
 *           type: boolean
 *           default: false
 *         groupItemsByPromotions:
 *           type: boolean
 *           default: false
 *         groupItemOnPrint:
 *           type: boolean
 *           default: false
 *         useProductNameOnPrint:
 *           type: boolean
 *           default: false
 *         customFontSize:
 *           type: integer
 *           default: 14
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

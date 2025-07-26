/**
 * @openapi
 * components:
 *   schemas:
 *     CompanyReceipt:
 *       type: object
 *       required:
 *         - name
 *         - companyId
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         displayName:
 *           type: string
 *         taxNumber:
 *           type: string
 *         email:
 *           type: string
 *         website:
 *           type: string
 *         refundDays:
 *           type: integer
 *           default: 7
 *         message:
 *           type: string
 *         showTaxBreakdown:
 *           type: boolean
 *           default: false
 *         sendEmailReceipt:
 *           type: boolean
 *           default: false
 *         showCustomerBalance:
 *           type: boolean
 *           default: false
 *         printCustomerAddress:
 *           type: boolean
 *           default: false
 *         showItemNodes:
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
 *         showBarCode:
 *           type: boolean
 *           default: false
 *         showProductName:
 *           type: boolean
 *           default: false
 *         showProductDescription:
 *           type: boolean
 *           default: false
 *         customFontSize:
 *           type: integer
 *           default: 14
 *         barCodeType:
 *           type: string
 *           default: CODE128
 *         qrCodeLink:
 *           type: string
 *           default: https://example.com/qr-code
 *         qrCodeDescription:
 *           type: string
 *           default: Scan this QR code for more information
 *         guid:
 *           type: integer
 *         companyId:
 *           type: string
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         fileName:
 *           type: string
 *           nullable: true
 *         contentType:
 *           type: string
 *           description: MIME type of the image (e.g., "image/jpeg", "image/png")
 *         fileSize:
 *           type: integer
 *           description: Size of the image in bytes
 *         isPrimary:
 *           type: boolean
 *           default: false
 *           description: Flag indicating if this is the primary product image
 *         altText:
 *           type: string
 *           nullable: true
 *           description: Alternative text for accessibility
 *         sortOrder:
 *           type: integer
 *           default: 0
 *           description: Order for displaying multiple images
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         imageUrl:
 *           type: string
 *           description: URL to access the image
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         costPrice:
 *           type: number
 *           format: float
 *         salePrice:
 *           type: number
 *           format: float
 *         unitOfSale:
 *           type: string
 *           enum: [cards, each, kg, litre, packet, cl, cm, cup, ft, g, gal, halfPint, in, l, lb, ml, m, oz]
 *         rating:
 *           type: number
 *           format: float
 *           nullable: true
 *         sellOnPos:
 *           type: boolean
 *           default: true
 *         sellOnTill:
 *           type: boolean
 *           default: true
 *         rrp:
 *           type: number
 *           format: float
 *           nullable: true
 *         variablePrice:
 *           type: boolean
 *           default: false
 *         taxExempt:
 *           type: boolean
 *           default: false
 *         warranty:
 *           type: integer
 *           nullable: true
 *         manufacturer:
 *           type: string
 *           nullable: true
 *         manufactureDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         posOrder:
 *           type: string
 *           nullable: true
 *           description: Must be unique across all products
 *         buttonColor:
 *           type: string
 *           default: "blue"
 *         scannableOnly:
 *           type: boolean
 *           default: false
 *         orderQuantityLimit:
 *           type: integer
 *           default: 100
 *         volumeOfSale:
 *           type: number
 *           format: float
 *           default: 1.0
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         brand:
 *           $ref: '#/components/schemas/Brand'
 *         taxRate:
 *           $ref: '#/components/schemas/TaxRate'
 *         barCode:
 *           $ref: '#/components/schemas/BarCode'
 *         productTag:
 *           $ref: '#/components/schemas/ProductTag'
 *         containerFee:
 *           $ref: '#/components/schemas/ContainerFee'
 *         mulitChoiceProductGroup:
 *           $ref: '#/components/schemas/MulitChoiceProductGroup'
 *         promotions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Promotions'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *           description: Product images
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateProduct:
 *       type: object
 *       required:
 *         - name
 *         - salePrice
 *         - costPrice
 *         - unitOfSale
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         costPrice:
 *           type: number
 *         salePrice:
 *           type: number
 *         unitOfSale:
 *           type: string
 *           enum: [cards, each, kg, litre, packet, cl, cm, cup, ft, g, gal, halfPint, in, l, lb, ml, m, oz]
 *         rating:
 *           type: number
 *         sellOnPos:
 *           type: boolean
 *         sellOnTill:
 *           type: boolean
 *         rrp:
 *           type: number
 *         variablePrice:
 *           type: boolean
 *         taxExempt:
 *           type: boolean
 *         warranty:
 *           type: integer
 *         manufacturer:
 *           type: string
 *         manufactureDate:
 *           type: string
 *           format: date-time
 *         expiryDate:
 *           type: string
 *           format: date-time
 *         posOrder:
 *           type: string
 *         buttonColor:
 *           type: string
 *         scannableOnly:
 *           type: boolean
 *         orderQuantityLimit:
 *           type: integer
 *         volumeOfSale:
 *           type: number
 *         categoryId:
 *           type: string
 *         brandId:
 *           type: string
 *         taxRateId:
 *           type: string
 *         productTagId:
 *           type: string
 *         containerFeeId:
 *           type: string
 *         mulitChoiceProductGroupId:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Product image files (up to 5 images, optional)
 *         isPrimaryImage:
 *           type: array
 *           items:
 *             type: boolean
 *           description: Whether the corresponding image is a primary image (array index should match images array)
 *         imageAltText:
 *           type: array
 *           items:
 *             type: string
 *           description: Alternative text for each image (array index should match images array)
 *     UpdateProduct:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         costPrice:
 *           type: number
 *         salePrice:
 *           type: number
 *         unitOfSale:
 *           type: string
 *           enum: [cards, each, kg, litre, packet, cl, cm, cup, ft, g, gal, halfPint, in, l, lb, ml, m, oz]
 *         rating:
 *           type: number
 *         sellOnPos:
 *           type: boolean
 *         sellOnTill:
 *           type: boolean
 *         rrp:
 *           type: number
 *         variablePrice:
 *           type: boolean
 *         taxExempt:
 *           type: boolean
 *         warranty:
 *           type: integer
 *         manufacturer:
 *           type: string
 *         manufactureDate:
 *           type: string
 *           format: date-time
 *         expiryDate:
 *           type: string
 *           format: date-time
 *         posOrder:
 *           type: string
 *         buttonColor:
 *           type: string
 *         scannableOnly:
 *           type: boolean
 *         orderQuantityLimit:
 *           type: integer
 *         volumeOfSale:
 *           type: number
 *         categoryId:
 *           type: string
 *         brandId:
 *           type: string
 *         taxRateId:
 *           type: string
 *         productTagId:
 *           type: string
 *         containerFeeId:
 *           type: string
 *         mulitChoiceProductGroupId:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Product image files (up to 5 images, optional)
 *         isPrimaryImage:
 *           type: array
 *           items:
 *             type: boolean
 *           description: Whether the corresponding image is a primary image (array index should match images array)
 *         imageAltText:
 *           type: array
 *           items:
 *             type: string
 *           description: Alternative text for each image (array index should match images array)
 */

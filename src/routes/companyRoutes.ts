import { Router } from 'express';
import {
  createCompany,
  getCompanyById,
  getCompanies,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController';

const router = Router();

/**
 * @openapi
 * /companies/create:
 *   post:
 *     summary: Create a new company
 *     tags:
 *       - Companies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               displayName:
 *                 type: string
 *               description:
 *                 type: string
 *               taxNumber:
 *                 type: string
 *               customCurrency:
 *                 type: string
 *               language:
 *                 type: string
 *                 default: en
 *               barCodeType:
 *                 type: string
 *                 default: CODE128
 *               qrCodeLink:
 *                 type: string
 *                 default: https://example.com/qr-code
 *               qrCodeDescription:
 *                 type: string
 *                 default: Scan this QR code for more information
 *               refundDays:
 *                 type: integer
 *                 default: 7
 *               showTaxBreakdown:
 *                 type: boolean
 *                 default: false
 *               showCustomerBalance:
 *                 type: boolean
 *                 default: false
 *               printCustomerAddress:
 *                 type: boolean
 *                 default: false
 *               groupItemsByPromotions:
 *                 type: boolean
 *                 default: false
 *               groupItemOnPrint:
 *                 type: boolean
 *                 default: false
 *               useProductNameOnPrint:
 *                 type: boolean
 *                 default: false
 *               customFontSize:
 *                 type: integer
 *                 default: 14
 *
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/create', createCompany);

/**
 * @openapi
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getCompanyById);

/**
 * @openapi
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getCompanies);

/**
 * @openapi
 * /companies/{id}:
 *   patch:
 *     summary: Update a company
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               displayName:
 *                 type: string
 *               description:
 *                 type: string
 *               taxNumber:
 *                 type: string
 *               customCurrency:
 *                 type: string
 *               language:
 *                 type: string
 *                 default: en
 *               barCodeType:
 *                 type: string
 *                 default: CODE128
 *               qrCodeLink:
 *                 type: string
 *                 default: https://example.com/qr-code
 *               qrCodeDescription:
 *                 type: string
 *                 default: Scan this QR code for more information
 *               refundDays:
 *                 type: integer
 *                 default: 7
 *               showTaxBreakdown:
 *                 type: boolean
 *                 default: false
 *               showCustomerBalance:
 *                 type: boolean
 *                 default: false
 *               printCustomerAddress:
 *                 type: boolean
 *                 default: false
 *               groupItemsByPromotions:
 *                 type: boolean
 *                 default: false
 *               groupItemOnPrint:
 *                 type: boolean
 *                 default: false
 *               useProductNameOnPrint:
 *                 type: boolean
 *                 default: false
 *               customFontSize:
 *                 type: integer
 *                 default: 14
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Company not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

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
router.patch('/:id', updateCompany);

/**
 * @openapi
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteCompany);

export default router;

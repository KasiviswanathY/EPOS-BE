/**
 * @openapi
 * tags:
 *   - name: CompanyReceipt
 *     description: Company receipt management endpoints
 */
import { Router } from 'express';
import {
  createCompanyReceipt,
  getCompanyReceiptById,
  updateCompanyReceipt,
  deleteCompanyReceipt,
  getCompanyReceiptsByCompanyId,
} from '../controllers/companyReceiptController';

const router = Router();

/**
 * @openapi
 * /company-receipts:
 *   post:
 *     summary: Create a new company receipt
 *     tags:
 *       - CompanyReceipt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyReceipt'
 *     responses:
 *       201:
 *         description: CompanyReceipt created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyReceipt'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/', createCompanyReceipt);

/**
 * @openapi
 * /company-receipts/{id}:
 *   get:
 *     summary: Get company receipt by ID
 *     tags:
 *       - CompanyReceipt
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CompanyReceipt found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyReceipt'
 *       404:
 *         description: CompanyReceipt not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getCompanyReceiptById);

/**
 * @openapi
 * /company-receipts/{id}:
 *   patch:
 *     summary: Update a company receipt
 *     tags:
 *       - CompanyReceipt
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
 *             $ref: '#/components/schemas/CompanyReceipt'
 *     responses:
 *       200:
 *         description: CompanyReceipt updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyReceipt'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: CompanyReceipt not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', updateCompanyReceipt);

/**
 * @openapi
 * /company-receipts/{id}:
 *   delete:
 *     summary: Delete a company receipt
 *     tags:
 *       - CompanyReceipt
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CompanyReceipt deleted successfully
 *       404:
 *         description: CompanyReceipt not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', deleteCompanyReceipt);

/**
 * @openapi
 * /company-receipts/company/{companyId}:
 *   get:
 *     summary: Get all company receipts by company ID
 *     tags:
 *       - CompanyReceipt
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of company receipts for the company
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyReceipt'
 *       404:
 *         description: No receipts found for this company
 *       500:
 *         description: Internal Server Error
 */
router.get('/company/:companyId', getCompanyReceiptsByCompanyId);

export default router;

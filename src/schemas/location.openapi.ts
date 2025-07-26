/**
 * @openapi
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - name
 *         - companyId
 *         - staffId
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         pincode:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           default: ACTIVE
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         language:
 *           type: string
 *           default: en
 *         timeZone:
 *           type: string
 *           default: UTC
 *         companyId:
 *           type: string
 *         staffId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         Devices:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *         OpeningHours:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               day:
 *                 type: string
 *               openTime:
 *                 type: string
 *               closeTime:
 *                 type: string
 *         Staff:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 */

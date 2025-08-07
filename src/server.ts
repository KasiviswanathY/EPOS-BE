import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import loginRoutes from './routes/loginRoutes';
import miscRoutes from './routes/miscRoutes';
import companyRoutes from './routes/companyRoutes';
import companyReceiptRoutes from './routes/companyReceiptRoutes';
import locationRoutes from './routes/locationRoutes';
import discountReasonRoutes from './routes/discountReasonRoutes';
import refundReasonRoutes from './routes/refundReasonRoutes';
import clockingTypeRoutes from './routes/clockingTypeRoutes';
import noSaleReasonRoutes from './routes/noSaleReasonRoutes';
import stockMovementReasonRoutes from './routes/stockMovementReasonRoutes';
import customerTypeRoutes from './routes/customerTypeRoutes';
import staffRoutes from './routes/staffRoutes';
import devicesRoutes from './routes/devicesRoutes';
import staffHoursRoutes from './routes/staffHoursRoutes';
import popupNoteRoutes from './routes/popupNoteRoutes';

import openingHoursRoutes from './routes/openingHoursRoutes';

import roleRoutes from './routes/roleRoutes';

import { errorHandler } from './handlers/errorHandler';
import { authHandler } from './handlers/authHandler';

import swaggerDocs from './utils/swagger';
import { config } from './config';

dotenv.config();

const app = express();

swaggerDocs(app);

app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors());

app.use(morgan('common'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api/v1/', loginRoutes);

app.use(authHandler);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/products', productRoutes);

// Company related routes
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/company-receipts', companyReceiptRoutes);
app.use('/api/v1/discount-reasons', discountReasonRoutes);
app.use('/api/v1/refund-reasons', refundReasonRoutes);
app.use('/api/v1/no-sale-reasons', noSaleReasonRoutes);
app.use('/api/v1/stock-movement-reasons', stockMovementReasonRoutes);
app.use('/api/v1/clocking-types', clockingTypeRoutes);
app.use('/api/v1/customer-types', customerTypeRoutes);

// Location related routes
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/devices', devicesRoutes);
app.use('/api/v1/opening-hours', openingHoursRoutes);

app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/staff-hours', staffHoursRoutes);

// Product related routes
app.use('/api/v1/popup-notes', popupNoteRoutes);

app.use('/api/v1/misc', miscRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on ${config.serverUrl}`);
});

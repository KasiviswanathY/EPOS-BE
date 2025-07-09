import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import loginRoutes from './routes/loginRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors());

app.use(morgan('common'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.use('/api/v1/login', loginRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

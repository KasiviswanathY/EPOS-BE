import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret as string, {
    expiresIn: '1H',
  });
};

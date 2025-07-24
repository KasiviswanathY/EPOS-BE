import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../primsaClient';
import { ApiError } from 'src/types/Error';

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.header('authorization') as string | undefined;

    if (!authHeader) {
      throw new ApiError({
        message: 'Authentication Failed. No authorization header provided',
        statusCode: 401,
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ApiError({
        message: 'Authentication Failed. No token provided',
        statusCode: 401,
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });

    if (user) {
      req.user = user;
      return next();
    }

    res.status(401).json({ error: 'Authentication Failed. Invalid token' });
  } catch (error: Error | any) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: error.message || 'Authentication failed' });
  }
};

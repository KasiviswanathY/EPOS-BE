import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from 'src/primsaClient';

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.header('authorization') as string | undefined;

    if (!authHeader) {
      throw new Error(
        'Authentication Failed. No authorization header provided',
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new Error('Authentication Failed. No token provided');
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

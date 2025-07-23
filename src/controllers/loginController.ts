import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../primsaClient';
import { generateAccessToken } from '../utils/generateAccessToken';
import { ApiError } from '../types/Error';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    let user;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    }

    if (username) {
      user = await prisma.user.findUnique({
        where: { username },
      });
    }

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (!user.password) {
      throw new ApiError('User does not have privileges to login', 403);
    }

    const isPasswordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }

    const token = generateAccessToken(user.id);

    res.status(200).json({
      token,
    });
  } catch (error: ApiError | any) {
    console.error('Error during login:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Login Failed' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, permissions } = req.body;

    let existingUser;

    if (email) {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    }

    if (username) {
      existingUser = await prisma.user.findUnique({
        where: { username },
      });
    }

    if (existingUser) {
      throw new ApiError('User already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        permissions,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(201).json({ user: newUser });
  } catch (error: ApiError | any) {
    console.error('Error during registration:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Registration Failed' });
  }
};

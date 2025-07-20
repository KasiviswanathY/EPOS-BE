import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from 'src/primsaClient';
import { generateAccessToken } from 'src/utils/generateAccessToken';

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
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.password) {
      res.status(400).json({ error: 'User does not have privileges to login' });
      return;
    }

    const isPasswordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateAccessToken(user.id);

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login Failed' });
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
      res.status(400).json({ error: 'User already exists' });
      return;
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
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration Failed' });
  }
};

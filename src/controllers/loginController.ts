import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from 'src/primsaClient';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isPasswordValid =
    user && (await bcrypt.compare(password, user.password));

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.status(200).json({
    message: 'Login successful',
    userId: user.userId,
    name: user.name,
    email: user.email,
  });
};

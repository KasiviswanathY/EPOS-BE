import { Request, Response } from 'express';
import { generateSalt } from '../utils/generateSalt';
import bcrypt from 'bcrypt';
import { prisma } from '../primsaClient';
import { Status, UserPermissionType } from '@prisma/client';

import { checkPermissions } from '../utils/checkPermissions';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const checkUserPermissions = checkPermissions(
      req.user,
      UserPermissionType.USER_RIGHTS,
    );

    if (!checkUserPermissions) {
      const err: any = new Error(
        'You do not have permission to access this resource.',
      );
      err.status = 403;
      throw err;
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        permissions: true,
      },
    });

    res.status(200).json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const checkUserPermissions = checkPermissions(
      req.user,
      UserPermissionType.USER_RIGHTS,
    );

    if (!checkUserPermissions) {
      const err: any = new Error(
        'You do not have permission to access this resource.',
      );
      err.status = 403;
      throw err;
    }

    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        permissions: true,
      },
    });

    if (!user) {
      const err: any = new Error('User not found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const checkUserPermissions = checkPermissions(
      req.user,
      UserPermissionType.USER_RIGHTS,
    );

    if (!checkUserPermissions) {
      const err: any = new Error(
        'You do not have permission to access this resource.',
      );
      err.status = 403;
      throw err;
    }

    const { username, email, password, status, permissions } = req.body;

    const salt = await generateSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        status: status || Status.ACTIVE,
        permissions,
      },
      select: {
        username: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        permissions: true,
        id: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const checkUserPermissions = checkPermissions(
      req.user,
      UserPermissionType.USER_RIGHTS,
    );

    if (!checkUserPermissions) {
      const err: any = new Error(
        'You do not have permission to access this resource.',
      );
      err.status = 403;
      throw err;
    }

    const { id } = req.params;
    const { username, email, password, status, permissions } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const err: any = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const updatedData: any = {
      username: username || user.username,
      email: email || user.email,
      status: status || user.status,
      permissions: permissions || user.permissions,
    };

    if (password) {
      const salt = await generateSalt();
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const checkUserPermissions = checkPermissions(
      req.user,
      UserPermissionType.USER_RIGHTS,
    );

    if (!checkUserPermissions) {
      const err: any = new Error(
        'You do not have permission to access this resource.',
      );
      err.status = 403;
      throw err;
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const err: any = new Error('User not found');
      err.status = 404;
      throw err;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const checkUserPermissions = checkPermissions(
      req.user,
      UserPermissionType.USER_RIGHTS,
    );
    if (!checkUserPermissions) {
      const err: any = new Error(
        'You do not have permission to access this resource.',
      );
      err.status = 403;
      throw err;
    }

    const { username, oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      const err: any = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      const err: any = new Error('Invalid old password');
      err.status = 400;
      throw err;
    }

    const salt = await generateSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return res.status(200).json({
      message: 'Password changed successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

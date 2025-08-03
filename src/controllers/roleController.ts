import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { Staff_Role_Permissions, UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

const validateRolePermissions = (permissions: string[]) =>
  permissions.every((permission: string) =>
    Object.values(Staff_Role_Permissions).includes(
      permission as Staff_Role_Permissions,
    ),
  );

export const createRole = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { name, description, permissions } = req.body;

    if (permissions && !Array.isArray(permissions)) {
      throw new ApiError({
        message: 'Permissions must be an array',
        statusCode: 400,
      });
    }

    if (!validateRolePermissions(permissions)) {
      throw new ApiError({
        message: 'Invalid permissions provided',
        statusCode: 400,
      });
    }

    const role = await prisma.role.create({
      data: { name, description, permissions },
    });

    res.status(201).json(role);
  } catch (error: ApiError | any) {
    console.error('Error creating role:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create role' });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const roles = await prisma.role.findMany();

    res.status(200).json(roles);
  } catch (error: ApiError | any) {
    console.error('Error fetching roles:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch roles' });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const role = await prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new ApiError({
        message: `Role with ID ${id} not found`,
        statusCode: 404,
      });
    }

    res.status(200).json(role);
  } catch (error: ApiError | any) {
    console.error('Error fetching role:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch role' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const roleExists = await prisma.role.findUnique({ where: { id } });

    if (!roleExists) {
      throw new ApiError({
        message: `Role with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const role = await prisma.role.update({
      where: { id },
      data: { name, description, permissions },
    });
    res.status(200).json(role);
  } catch (error: ApiError | any) {
    console.error('Error updating role:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update role' });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const roleExists = await prisma.role.findUnique({ where: { id } });

    if (!roleExists) {
      throw new ApiError({
        message: `Role with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.role.delete({ where: { id } });
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting role:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete role' });
  }
};

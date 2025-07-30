import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createCustomerType = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { name, description, discount } = req.body;
    const customerType = await prisma.customerType.create({
      data: { name, description, discount: discount ?? 0.0 },
    });

    res.status(201).json(customerType);
  } catch (error: ApiError | any) {
    console.error('Error creating customer type:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create customer type' });
  }
};

export const getCustomerTypes = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const customerTypes = await prisma.customerType.findMany();
    res.status(200).json(customerTypes);
  } catch (error: ApiError | any) {
    console.error('Error fetching customer types:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch customer types' });
  }
};

export const getCustomerTypeById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const customerType = await prisma.customerType.findUnique({
      where: { id },
    });

    if (!customerType) {
      throw new ApiError({
        message: `Customer type with ID ${id} not found`,
        statusCode: 404,
      });
    }

    res.status(200).json(customerType);
  } catch (error: ApiError | any) {
    console.error('Error fetching customer type:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch customer type' });
  }
};

export const updateCustomerType = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { name, description, discount } = req.body;

    const customerTypeExists = await prisma.customerType.findUnique({
      where: { id },
    });

    if (!customerTypeExists) {
      throw new ApiError({
        message: `Customer type with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const customerType = await prisma.customerType.update({
      where: { id },
      data: { name, description, discount },
    });

    res.status(200).json(customerType);
  } catch (error: ApiError | any) {
    console.error('Error updating customer type:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update customer type' });
  }
};

export const deleteCustomerType = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const customerTypeExists = await prisma.customerType.findUnique({
      where: { id },
    });

    if (!customerTypeExists) {
      throw new ApiError({
        message: `Customer type with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.customerType.delete({ where: { id } });
    res.status(200).json({ message: 'Customer type deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting customer type:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete customer type' });
  }
};

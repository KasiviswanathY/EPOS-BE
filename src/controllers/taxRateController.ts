import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const getTaxRates = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [taxRates, total] = await Promise.all([
      prisma.taxRate.findMany({
        skip,
        take: pageSize,
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.taxRate.count(),
    ]);

    res.status(200).json({
      data: taxRates,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching tax rates:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch tax rates',
    });
  }
};

export const getTaxRateById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const taxRate = await prisma.taxRate.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            salePrice: true,
            costPrice: true,
          },
        },
      },
    });

    if (!taxRate) {
      throw new ApiError({ message: 'Tax rate not found', statusCode: 404 });
    }

    res.status(200).json(taxRate);
  } catch (error: ApiError | any) {
    console.error('Error fetching tax rate:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch tax rate',
    });
  }
};

export const createTaxRate = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { name, percentage } = req.body;

    if (!name || percentage === undefined || percentage === null) {
      throw new ApiError({
        message: 'Name and percentage are required',
        statusCode: 400,
      });
    }

    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      throw new ApiError({
        message: 'Percentage must be a number between 0 and 100',
        statusCode: 400,
      });
    }

    const existingTaxRate = await prisma.taxRate.findUnique({
      where: { name },
    });
    if (existingTaxRate) {
      throw new ApiError({
        message: 'Tax rate with this name already exists',
        statusCode: 409,
      });
    }

    const taxRate = await prisma.taxRate.create({
      data: {
        name,
        percentage,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(taxRate);
  } catch (error: ApiError | any) {
    console.error('Error creating tax rate:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create tax rate',
    });
  }
};

export const updateTaxRate = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { name, percentage } = req.body;

    const existingTaxRate = await prisma.taxRate.findUnique({
      where: { id },
    });
    if (!existingTaxRate) {
      throw new ApiError({ message: 'Tax rate not found', statusCode: 404 });
    }

    if (percentage !== undefined && (typeof percentage !== 'number' || percentage < 0 || percentage > 100)) {
      throw new ApiError({
        message: 'Percentage must be a number between 0 and 100',
        statusCode: 400,
      });
    }

    if (name && name !== existingTaxRate.name) {
      const duplicateName = await prisma.taxRate.findUnique({
        where: { name },
      });
      if (duplicateName) {
        throw new ApiError({
          message: 'Tax rate with this name already exists',
          statusCode: 409,
        });
      }
    }

    const taxRate = await prisma.taxRate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(percentage !== undefined && { percentage }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json(taxRate);
  } catch (error: ApiError | any) {
    console.error('Error updating tax rate:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to update tax rate',
    });
  }
};

export const deleteTaxRate = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const taxRate = await prisma.taxRate.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!taxRate) {
      throw new ApiError({ message: 'Tax rate not found', statusCode: 404 });
    }

    if (taxRate.product.length > 0) {
      throw new ApiError({
        message: 'Cannot delete tax rate with associated products',
        statusCode: 400,
      });
    }

    await prisma.taxRate.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Tax rate deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting tax rate:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete tax rate',
    });
  }
};

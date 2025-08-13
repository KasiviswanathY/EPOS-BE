import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const getBarCodes = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [barCodes, total] = await Promise.all([
      prisma.barCode.findMany({
        skip,
        take: pageSize,
        include: {
          product: true,
        },
      }),
      prisma.barCode.count(),
    ]);

    res.status(200).json({
      data: barCodes,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching barcodes:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch barcodes',
    });
  }
};

export const getBarCodeById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const barCode = await prisma.barCode.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!barCode) {
      throw new ApiError({ message: 'Barcode not found', statusCode: 404 });
    }

    res.status(200).json(barCode);
  } catch (error: ApiError | any) {
    console.error('Error fetching barcode:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch barcode',
    });
  }
};

export const createBarCode = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { code, productId } = req.body;

    if (!code) {
      throw new ApiError({
        message: 'Code is required',
        statusCode: 400,
      });
    }

    if (!productId) {
      throw new ApiError({
        message: 'Product ID is required',
        statusCode: 400,
      });
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      throw new ApiError({
        message: 'Product not found',
        statusCode: 404,
      });
    }

    // Check if barcode already exists
    const existingBarCode = await prisma.barCode.findFirst({
      where: { code },
    });

    if (existingBarCode) {
      throw new ApiError({
        message: 'Barcode with this code already exists',
        statusCode: 400,
      });
    }

    const barCode = await prisma.barCode.create({
      data: {
        id: code,
        code,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(barCode);
  } catch (error: ApiError | any) {
    console.error('Error creating barcode:', error);
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to create barcode',
    });
  }
};

export const updateBarCode = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { code } = req.body;

    const barCodeExists = await prisma.barCode.findUnique({ where: { id } });
    if (!barCodeExists) {
      throw new ApiError({
        message: `Barcode with ID ${id} not found`,
        statusCode: 404,
      });
    }

    if (code) {
      const existingBarCode = await prisma.barCode.findFirst({
        where: {
          code,
          NOT: {
            id,
          },
        },
      });

      if (existingBarCode) {
        throw new ApiError({
          message: 'Barcode with this code already exists',
          statusCode: 400,
        });
      }
    }

    const barCode = await prisma.barCode.update({
      where: { id },
      data: { code },
      include: {
        product: true,
      },
    });

    res.status(200).json(barCode);
  } catch (error: ApiError | any) {
    console.error('Error updating barcode:', error);
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to update barcode',
    });
  }
};

export const deleteBarCode = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const barCodeExists = await prisma.barCode.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!barCodeExists) {
      throw new ApiError({
        message: `Barcode with ID ${id} not found`,
        statusCode: 404,
      });
    }

    // Check if barcode is associated with any product
    if (barCodeExists.product) {
      throw new ApiError({
        message: 'Cannot delete barcode as it is associated with a product',
        statusCode: 400,
      });
    }

    await prisma.barCode.delete({ where: { id } });
    res.status(200).json({ message: 'Barcode deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting barcode:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete barcode',
    });
  }
};

import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createStockMovementReason = async (
  req: Request,
  res: Response,
) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { reason } = req.body;
    const stockMovementReason = await prisma.stockMovementReason.create({
      data: { reason },
    });
    res.status(201).json(stockMovementReason);
  } catch (error: ApiError | any) {
    console.error('Error creating stock movement reason:', error);
    res
      .status(error.statusCode || 500)
      .json({
        error: error.message || 'Failed to create stock movement reason',
      });
  }
};

export const getAllStockMovementReasons = async (
  req: Request,
  res: Response,
) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const stockMovementReasons = await prisma.stockMovementReason.findMany();
    res.status(200).json(stockMovementReasons);
  } catch (error: ApiError | any) {
    console.error('Error fetching stock movement reasons:', error);
    res
      .status(error.statusCode || 500)
      .json({
        error: error.message || 'Failed to fetch stock movement reasons',
      });
  }
};

export const getStockMovementReasonById = async (
  req: Request,
  res: Response,
) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const stockMovementReason = await prisma.stockMovementReason.findUnique({
      where: { id },
    });

    if (!stockMovementReason) {
      throw new ApiError({
        message: `Stock movement reason with ID ${id} not found`,
        statusCode: 404,
      });
    }

    res.status(200).json(stockMovementReason);
  } catch (error: ApiError | any) {
    console.error('Error fetching stock movement reason:', error);
    res
      .status(error.statusCode || 500)
      .json({
        error: error.message || 'Failed to fetch stock movement reason',
      });
  }
};

export const updateStockMovementReason = async (
  req: Request,
  res: Response,
) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const { reason } = req.body;
    const stockMovementReasonExists =
      await prisma.stockMovementReason.findUnique({
        where: { id },
      });

    if (!stockMovementReasonExists) {
      throw new ApiError({
        message: `Stock movement reason with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const stockMovementReason = await prisma.stockMovementReason.update({
      where: { id },
      data: { reason },
    });

    res.status(200).json(stockMovementReason);
  } catch (error: ApiError | any) {
    console.error('Error updating stock movement reason:', error);
    res
      .status(error.statusCode || 500)
      .json({
        error: error.message || 'Failed to update stock movement reason',
      });
  }
};

export const deleteStockMovementReason = async (
  req: Request,
  res: Response,
) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const stockMovementReasonExists =
      await prisma.stockMovementReason.findUnique({
        where: { id },
      });

    if (!stockMovementReasonExists) {
      throw new ApiError({
        message: `Stock movement reason with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.stockMovementReason.delete({ where: { id } });
    res
      .status(200)
      .json({ message: 'Stock movement reason deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting stock movement reason:', error);
    res
      .status(error.statusCode || 500)
      .json({
        error: error.message || 'Failed to delete stock movement reason',
      });
  }
};

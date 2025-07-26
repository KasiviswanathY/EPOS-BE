import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createDiscountReason = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { reason, defaultValue } = req.body;
    const discountReason = await prisma.discountReason.create({
      data: { reason, defaultValue },
    });
    res.status(201).json(discountReason);
  } catch (error: ApiError | any) {
    console.error('Error creating discount reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create discount reason' });
  }
};

export const getDiscountReasons = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );
    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const discountReasons = await prisma.discountReason.findMany();
    res.status(200).json(discountReasons);
  } catch (error: ApiError | any) {
    console.error('Error fetching discount reasons:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch discount reasons' });
  }
};

export const getDiscountReasonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const discountReason = await prisma.discountReason.findUnique({
      where: { id },
    });

    if (!discountReason) {
      throw new ApiError({
        message: 'Discount reason not found',
        statusCode: 404,
      });
    }

    res.status(200).json(discountReason);
  } catch (error: ApiError | any) {
    console.error('Error fetching discount reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch discount reason' });
  }
};

export const updateDiscountReason = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const { reason, defaultValue } = req.body;

    const discountReason = await prisma.discountReason.update({
      where: { id },
      data: { reason, defaultValue },
    });

    res.status(200).json(discountReason);
  } catch (error: ApiError | any) {
    console.error('Error updating discount reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update discount reason' });
  }
};

export const deleteDiscountReason = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    await prisma.discountReason.delete({ where: { id } });

    res.status(200).json({ message: 'Discount reason deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting discount reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete discount reason' });
  }
};

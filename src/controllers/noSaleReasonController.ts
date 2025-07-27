import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createNoSaleReason = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { reason } = req.body;
    const noSaleReason = await prisma.noSaleReason.create({
      data: { reason },
    });

    res.status(201).json(noSaleReason);
  } catch (error: ApiError | any) {
    console.error('Error creating no sale reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create no sale reason' });
  }
};

export const getNoSaleReasons = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }
    const noSaleReasons = await prisma.noSaleReason.findMany();
    res.status(200).json(noSaleReasons);
  } catch (error: ApiError | any) {
    console.error('Error fetching no sale reasons:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch no sale reasons' });
  }
};

export const getNoSaleReasonById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }
    const { id } = req.params;
    const noSaleReason = await prisma.noSaleReason.findUnique({
      where: { id },
    });

    if (!noSaleReason) {
      throw new ApiError({
        message: 'No sale reason not found',
        statusCode: 404,
      });
    }

    res.status(200).json(noSaleReason);
  } catch (error: ApiError | any) {
    console.error('Error fetching no sale reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch no sale reason' });
  }
};

export const updateNoSaleReason = async (req: Request, res: Response) => {
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

    const noSaleReasonExists = await prisma.noSaleReason.findUnique({
      where: { id },
    });

    if (!noSaleReasonExists) {
      throw new ApiError({
        message: 'No sale reason not found',
        statusCode: 404,
      });
    }

    const noSaleReason = await prisma.noSaleReason.update({
      where: { id },
      data: { reason },
    });

    res.status(200).json(noSaleReason);
  } catch (error: ApiError | any) {
    console.error('Error updating no sale reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update no sale reason' });
  }
};

export const deleteNoSaleReason = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;

    const noSaleReasonExists = await prisma.noSaleReason.findUnique({
      where: { id },
    });

    if (!noSaleReasonExists) {
      throw new ApiError({
        message: 'No sale reason not found',
        statusCode: 404,
      });
    }

    await prisma.noSaleReason.delete({ where: { id } });
    res.status(200).json({ message: 'No sale reason deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting no sale reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete no sale reason' });
  }
};

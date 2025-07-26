import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createRefundReason = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { description, shortDescription, returnToStock } = req.body;
    const refundReason = await prisma.refundReason.create({
      data: {
        description,
        shortDescription,
        returnToStock: returnToStock || false,
      },
    });
    res.status(201).json(refundReason);
  } catch (error: ApiError | any) {
    console.error('Error creating refund reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create refund reason' });
  }
};

export const getRefundReasons = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const refundReasons = await prisma.refundReason.findMany();

    res.status(200).json(refundReasons);
  } catch (error: ApiError | any) {
    console.error('Error fetching refund reasons:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch refund reasons' });
  }
};

export const getRefundReasonById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const refundReason = await prisma.refundReason.findUnique({
      where: { id },
    });

    if (!refundReason) {
      throw new ApiError({
        message: `Refund reason with ID ${id} not found`,
        statusCode: 404,
      });
    }

    res.status(200).json(refundReason);
  } catch (error) {
    console.error('Error fetching refund reason:', error);
    res.status(500).json({ error: 'Failed to fetch refund reason' });
  }
};

export const updateRefundReason = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const { description, shortDescription, returnToStock } = req.body;

    const refundReasonExists = await prisma.refundReason.findUnique({
      where: { id },
    });

    if (!refundReasonExists) {
      throw new ApiError({
        message: `Refund reason with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const refundReason = await prisma.refundReason.update({
      where: { id },
      data: { description, shortDescription, returnToStock },
    });

    res.status(200).json(refundReason);
  } catch (error: ApiError | any) {
    console.error('Error updating refund reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update refund reason' });
  }
};

export const deleteRefundReason = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;

    const refundReasonExists = await prisma.refundReason.findUnique({
      where: { id },
    });

    if (!refundReasonExists) {
      throw new ApiError({
        message: `Refund reason with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.refundReason.delete({ where: { id } });
    res.status(200).json({ message: 'Refund reason deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting refund reason:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete refund reason' });
  }
};

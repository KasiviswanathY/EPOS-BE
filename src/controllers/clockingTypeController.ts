import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createClockingType = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { name, payMultiplier } = req.body;
    const clockingType = await prisma.clockingType.create({
      data: { name, payMultiplier: payMultiplier ?? 1.0 },
    });

    res.status(201).json(clockingType);
  } catch (error: ApiError | any) {
    console.error('Error creating clocking type:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create clocking type' });
  }
};

export const getClockingTypes = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const clockingTypes = await prisma.clockingType.findMany();

    res.status(200).json(clockingTypes);
  } catch (error: ApiError | any) {
    console.error('Error fetching clocking types:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch clocking types' });
  }
};

export const getClockingTypeById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const clockingType = await prisma.clockingType.findUnique({
      where: { id },
    });

    if (!clockingType) {
      throw new ApiError({
        message: `Clocking type with ID ${id} not found`,
        statusCode: 404,
      });
    }

    res.status(200).json(clockingType);
  } catch (error: ApiError | any) {
    console.error('Error fetching clocking type:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch clocking type' });
  }
};

export const updateClockingType = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { name, payMultiplier } = req.body;
    const clockingTypeExists = await prisma.clockingType.findUnique({
      where: { id },
    });

    if (!clockingTypeExists) {
      throw new ApiError({
        message: `Clocking type with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const clockingType = await prisma.clockingType.update({
      where: { id },
      data: { name, payMultiplier },
    });

    res.status(200).json(clockingType);
  } catch (error: ApiError | any) {
    console.error('Error updating clocking type:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update clocking type' });
  }
};

export const deleteClockingType = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const clockingTypeExists = await prisma.clockingType.findUnique({
      where: { id },
    });

    if (!clockingTypeExists) {
      throw new ApiError({
        message: `Clocking type with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.clockingType.delete({ where: { id } });

    res.status(200).json({ message: 'Clocking type deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting clocking type:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete clocking type' });
  }
};

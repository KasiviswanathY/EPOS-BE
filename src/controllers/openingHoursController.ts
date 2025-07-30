import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createOpeningHours = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { day, openTime, closeTime, locationId } = req.body;

    if (!locationId) {
      throw new ApiError({
        message: 'Location ID is mandatory for creating opening hours',
        statusCode: 400,
      });
    }

    const locationExists = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!locationExists) {
      throw new ApiError({
        message: `Location with ID ${locationId} not found`,
        statusCode: 404,
      });
    }

    const openingHours = await prisma.openingHours.create({
      data: { day, openTime, closeTime, locationId },
      include: {
        location: true,
      },
    });

    res.status(201).json(openingHours);
  } catch (error: ApiError | any) {
    console.error('Error creating opening hours:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create opening hours' });
  }
};

export const getOpeningHours = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const openingHours = await prisma.openingHours.findMany();
    res.status(200).json(openingHours);
  } catch (error: ApiError | any) {
    console.error('Error fetching opening hours:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch opening hours' });
  }
};

export const getOpeningHoursById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const openingHours = await prisma.openingHours.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });

    if (!openingHours) {
      throw new ApiError({
        message: `Opening hours with ID ${id} not found`,
        statusCode: 404,
      });
    }
    res.status(200).json(openingHours);
  } catch (error: ApiError | any) {
    console.error('Error fetching opening hours:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch opening hours' });
  }
};

export const updateOpeningHours = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const openingHoursExists = await prisma.openingHours.findUnique({
      where: { id },
    });

    if (!openingHoursExists) {
      throw new ApiError({
        message: `Opening hours with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const openingHours = await prisma.openingHours.update({
      where: { id },
      data: { ...req.body },
      include: {
        location: true,
      },
    });

    res.status(200).json(openingHours);
  } catch (error: ApiError | any) {
    console.error('Error updating opening hours:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update opening hours' });
  }
};

export const deleteOpeningHours = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const openingHoursExists = await prisma.openingHours.findUnique({
      where: { id },
    });

    if (!openingHoursExists) {
      throw new ApiError({
        message: `Opening hours with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.openingHours.delete({ where: { id } });
    res
      .status(200)
      .json({ message: `Opening hours with ID ${id} deleted successfully` });
  } catch (error: ApiError | any) {
    console.error('Error deleting opening hours:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete opening hours' });
  }
};

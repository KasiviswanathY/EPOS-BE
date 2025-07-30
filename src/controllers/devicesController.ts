import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createDevice = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const {
      name,
      description,
      type,
      locationId,
      enabled,
      priceMode,
      autoClose,
    } = req.body;

    if (!locationId) {
      throw new ApiError({
        message: 'Location ID is mandatory for creating a device',
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

    const device = await prisma.devices.create({
      data: {
        name,
        description,
        type,
        locationId,
        enabled,
        priceMode,
        autoClose,
      },
      include: {
        location: true,
      },
    });

    res.status(201).json(device);
  } catch (error: ApiError | any) {
    console.error('Error creating device:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create device' });
  }
};

export const getDevices = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const devices = await prisma.devices.findMany({
      include: {
        location: true,
      },
    });

    res.status(200).json(devices);
  } catch (error: ApiError | any) {
    console.error('Error fetching devices:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch devices' });
  }
};

export const getDeviceById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const device = await prisma.devices.findUnique({
      where: { id },
      include: { location: true },
    });

    if (!device) {
      throw new ApiError({
        message: `Device with ID ${id} not found`,
        statusCode: 404,
      });
    }
    res.status(200).json(device);
  } catch (error: ApiError | any) {
    console.error('Error fetching device:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch device' });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const deviceExists = await prisma.devices.findUnique({ where: { id } });

    if (!deviceExists) {
      throw new ApiError({
        message: `Device with ID ${id} not found`,
        statusCode: 404,
      });
    }
    const device = await prisma.devices.update({
      where: { id },
      data: { ...req.body },
      include: {
        location: true,
      },
    });
    res.status(200).json(device);
  } catch (error: ApiError | any) {
    console.error('Error updating device:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update device' });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const deviceExists = await prisma.devices.findUnique({ where: { id } });

    if (!deviceExists) {
      throw new ApiError({
        message: `Device with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.devices.delete({ where: { id } });
    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting device:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete device' });
  }
};

import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const getStaffHours = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const staffHours = await prisma.staffHours.findMany({
      include: { staff: true, clockingType: true, location: true },
    });

    res.status(200).json(staffHours);
  } catch (error: ApiError | any) {
    console.error('Error fetching staff hours:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch staff hours' });
  }
};

export const getStaffHoursById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();
    const staffHours = await prisma.staffHours.findUnique({
      where: { id: req.params.id },
      include: { staff: true, clockingType: true, location: true },
    });

    if (!staffHours) {
      throw new ApiError({ message: 'StaffHours not found', statusCode: 404 });
    }

    res.status(200).json(staffHours);
  } catch (error: ApiError | any) {
    console.error('Error fetching staff hours:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch staff hours' });
  }
};

export const createStaffHours = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { staffId, locationId, clockingTypeId } = req.body;

    if (!staffId || !locationId || !clockingTypeId) {
      throw new ApiError({
        message: 'Staff ID, Location ID, and Clocking Type ID are required',
        statusCode: 400,
      });
    }

    const staffExists = await prisma.staff.findUnique({
      where: { id: staffId },
    });

    if (!staffExists) {
      throw new ApiError({
        message: `Staff with ID ${staffId} not found`,
        statusCode: 404,
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

    const staffHours = await prisma.staffHours.create({
      data: req.body,
    });

    res.status(201).json(staffHours);
  } catch (error: ApiError | any) {
    console.error('Error creating staff hours:', error);
    res
      .status(error.statusCode || 400)
      .json({ error: error.message || 'Failed to create staff hours' });
  }
};

export const updateStaffHours = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const staffHoursExists = await prisma.staffHours.findUnique({
      where: { id: req.params.id },
    });

    if (!staffHoursExists) {
      throw new ApiError({
        message: `StaffHours with ID ${req.params.id} not found`,
        statusCode: 404,
      });
    }

    if (req.body.staffId) {
      const staffExists = await prisma.staff.findUnique({
        where: { id: req.body.staffId },
      });
      if (!staffExists) {
        throw new ApiError({
          message: `Staff with ID ${req.body.staffId} not found`,
          statusCode: 404,
        });
      }
    }

    if (req.body.locationId) {
      const locationExists = await prisma.location.findUnique({
        where: { id: req.body.locationId },
      });
      if (!locationExists) {
        throw new ApiError({
          message: `Location with ID ${req.body.locationId} not found`,
          statusCode: 404,
        });
      }
    }

    const staffHours = await prisma.staffHours.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json(staffHours);
  } catch (error: ApiError | any) {
    console.error('Error updating staff hours:', error);
    res
      .status(error.statusCode || 400)
      .json({ error: error.message || 'Failed to update staff hours' });
  }
};

export const deleteStaffHours = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const staffHoursExists = await prisma.staffHours.findUnique({
      where: { id: req.params.id },
    });

    if (!staffHoursExists) {
      throw new ApiError({
        message: `StaffHours with ID ${req.params.id} not found`,
        statusCode: 404,
      });
    }

    await prisma.staffHours.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'StaffHours deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting staff hours:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete staff hours' });
  }
};

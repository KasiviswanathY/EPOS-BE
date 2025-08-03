import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType, Status } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const getStaff = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const staff = await prisma.staff.findMany({
      include: { role: true, mainLocation: true, StaffHours: true },
    });

    res.status(200).json(staff);
  } catch (error: ApiError | any) {
    console.error('Error fetching staff:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch staff' });
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const staff = await prisma.staff.findUnique({
      where: { id: req.params.id },
      include: { role: true, mainLocation: true, StaffHours: true },
    });

    if (!staff) {
      throw new ApiError({ message: 'Staff not found', statusCode: 404 });
    }

    res.status(200).json(staff);
  } catch (error: ApiError | any) {
    console.error('Error fetching staff:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch staff' });
  }
};

export const createStaff = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const {
      name,
      status,
      availableForAllLocations,
      passcode,
      swipeLogin,
      hourlyRate,
      isDeleted,
      roleId,
      mainLocationId,
    } = req.body;

    if (!name || !status || !roleId || !mainLocationId) {
      throw new ApiError({
        message: 'Missing required fields',
        statusCode: 400,
      });
    }

    if (!Object.values(Status).includes(status)) {
      throw new ApiError({ message: 'Invalid status value', statusCode: 400 });
    }

    if (!mainLocationId) {
      throw new ApiError({
        message: 'Main location ID is required',
        statusCode: 400,
      });
    }

    const mainLocationExists = await prisma.location.findUnique({
      where: { id: mainLocationId },
    });

    if (!mainLocationExists) {
      throw new ApiError({
        message: 'Main location not found',
        statusCode: 404,
      });
    }

    const roleExists = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!roleExists) {
      throw new ApiError({
        message: 'Role not found',
        statusCode: 404,
      });
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        status,
        availableForAllLocations,
        passcode,
        swipeLogin,
        hourlyRate,
        isDeleted,
        roleId,
        mainLocationId,
      },
    });

    res.status(201).json(staff);
  } catch (error: ApiError | any) {
    console.error('Error creating staff:', error);
    res
      .status(error.statusCode || 400)
      .json({ error: error.message || 'Failed to create staff' });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const {
      name,
      status,
      availableForAllLocations,
      passcode,
      swipeLogin,
      hourlyRate,
      isDeleted,
      roleId,
      mainLocationId,
    } = req.body;

    const staffExists = await prisma.staff.findUnique({ where: { id } });
    if (!staffExists) {
      throw new ApiError({
        message: `Staff with ID ${id} not found`,
        statusCode: 404,
      });
    }

    if (status && !Object.values(Status).includes(status)) {
      throw new ApiError({ message: 'Invalid status value', statusCode: 400 });
    }

    if (mainLocationId) {
      const mainLocationExists = await prisma.location.findUnique({
        where: { id: mainLocationId },
      });

      if (!mainLocationExists) {
        throw new ApiError({
          message: 'Main location not found',
          statusCode: 404,
        });
      }
    }

    if (roleId) {
      const roleExists = await prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!roleExists) {
        throw new ApiError({
          message: 'Role not found',
          statusCode: 404,
        });
      }
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        name,
        status,
        availableForAllLocations,
        passcode,
        swipeLogin,
        hourlyRate,
        isDeleted,
        roleId,
        mainLocationId,
      },
    });
    res.status(200).json(staff);
  } catch (error: ApiError | any) {
    console.error('Error updating staff:', error);
    res
      .status(error.statusCode || 400)
      .json({ error: error.message || 'Failed to update staff' });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const staffExists = await prisma.staff.findUnique({ where: { id } });

    if (!staffExists) {
      throw new ApiError({
        message: `Staff with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.staff.delete({ where: { id } });
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting staff:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete staff' });
  }
};

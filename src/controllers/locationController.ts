import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const createLocation = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const {
      name,
      address,
      city,
      country,
      pincode,
      description,
      status,
      email,
      phone,
      language,
      timeZone,
      companyId,
      staffId,
    } = req.body;

    if (!name) {
      throw new ApiError({
        message: 'Name is mandatory for creating a location',
        statusCode: 400,
      });
    }

    if (!companyId) {
      throw new ApiError({
        message: 'Company ID is mandatory for creating a location',
        statusCode: 400,
      });
    }

    const companyExists = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!companyExists) {
      throw new ApiError({
        message: 'Company not found',
        statusCode: 404,
      });
    }

    const newLocation = await prisma.location.create({
      data: {
        name,
        address,
        city,
        country,
        pincode,
        description,
        status: status || 'ACTIVE',
        email,
        phone,
        language: language || 'en',
        timeZone: timeZone || 'UTC',
        companyId,
        staffId,
      },
    });

    res.status(201).json(newLocation);
  } catch (error: ApiError | any) {
    console.error('Error creating location:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to create location' });
  }
};

export const getLocations = async (_req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      _req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const locations = await prisma.location.findMany({
      include: {
        company: true,
        Devices: true,
        OpeningHours: true,
      },
    });
    res.status(200).json(locations);
  } catch (error: ApiError | any) {
    console.error('Error fetching locations:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch locations' });
  }
};

export const getLocationById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;

    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        company: true,
        Devices: true,
        OpeningHours: true,
        Staff: true,
      },
    });

    if (!location) {
      throw new ApiError({
        message: 'Location not found',
        statusCode: 404,
      });
    }

    res.status(200).json(location);
  } catch (error: ApiError | any) {
    console.error('Error fetching location:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to fetch location' });
  }
};

export const getLocationsByCompanyId = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { companyId } = req.params;

    const locations = await prisma.location.findMany({
      where: { companyId },
      include: {
        Devices: true,
        OpeningHours: true,
      },
    });

    if (locations.length === 0) {
      throw new ApiError({
        message: 'No locations found for this company',
        statusCode: 404,
      });
    }

    res.status(200).json(locations);
  } catch (error: ApiError | any) {
    console.error('Error fetching locations by company ID:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch locations by company ID',
    });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;

    const locationExists = await prisma.location.findUnique({
      where: { id },
    });

    if (!locationExists) {
      throw new ApiError({
        message: `Location with ID ${id} not found`,
        statusCode: 404,
      });
    }

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        ...req.body,
      },
    });

    res.status(200).json(updatedLocation);
  } catch (error: ApiError | any) {
    console.error('Error updating location:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to update location' });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;

    const locationExists = await prisma.location.findUnique({
      where: { id },
    });

    if (!locationExists) {
      throw new ApiError({
        message: 'Location not found',
        statusCode: 404,
      });
    }

    await prisma.location.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting location:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Failed to delete location' });
  }
};

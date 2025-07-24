import { UserPermissionType } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from 'src/primsaClient';
import { ApiError } from 'src/types/Error';
import { checkPermissions } from 'src/utils/checkPermissions';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new ApiError(
        'You do not have permission to create a Company.',
        403,
      );
    }

    const newCompany = await prisma.company.create({
      data: req.body,
    });

    res.status(201).json(newCompany);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new ApiError('You do not have permission to view companies.', 403);
    }

    const companies = await prisma.company.findMany();
    res.status(200).json(companies);
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new ApiError(
        'You do not have permission to view this company.',
        403,
      );
    }

    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new ApiError('Company not found', 404);
    }

    res.status(200).json(company);
  } catch (error: any) {
    console.error('Error fetching company:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new ApiError(
        'You do not have permission to update this company.',
        403,
      );
    }

    const { id } = req.params;
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(updatedCompany);
  } catch (error: any) {
    console.error('Error updating company:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new ApiError(
        'You do not have permission to delete this company.',
        403,
      );
    }

    const { id } = req.params;
    await prisma.company.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting company:', error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

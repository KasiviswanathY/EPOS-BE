import { UserPermissionType } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { ApiError } from '../types/Error';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { checkPermissions } from '../utils/checkPermissions';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { name } = req.body;

    if (!name) {
      throw new ApiError({
        message: 'Name is mandatory for Company',
        statusCode: 400,
      });
    }

    const newCompany = await prisma.company.create({
      data: req.body,
    });

    res.status(201).json(newCompany);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res
      .status(error.statusCode || 500)
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
      throw new UnauthorizedError();
    }

    const companies = await prisma.company.findMany();
    res.status(200).json(companies);
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    res
      .status(error.statusCode || 500)
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
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new ApiError({
        message: 'Company not found',
        statusCode: 404,
      });
    }

    res.status(200).json(company);
  } catch (error: any) {
    console.error('Error fetching company:', error);
    res
      .status(error.statusCode || 500)
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
      throw new UnauthorizedError();
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
      .status(error.statusCode || 500)
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
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    await prisma.company.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting company:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Internal Server Error' });
  }
};

import { UserPermissionType } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { ApiError } from '../types/Error';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { checkPermissions } from '../utils/checkPermissions';

export const createCompanyReceipt = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );
    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { companyId, ...rest } = req.body;

    if (!companyId) {
      throw new ApiError({
        message: 'Company ID is required',
        statusCode: 400,
      });
    }

    const companyReceipt = await prisma.companyReceipt.create({
      data: {
        ...rest,
        Company: {
          connect: {
            id: req.body.companyId,
          },
        },
      },
      include: {
        Company: true,
      },
    });

    res.status(201).json(companyReceipt);
  } catch (err: ApiError | any) {
    console.error('Error creating company receipt:', err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'Internal Server Error' });
  }
};

export const getCompanyReceiptById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );
    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const companyReceipt = await prisma.companyReceipt.findUnique({
      where: { id },
    });

    if (!companyReceipt) {
      throw new ApiError({
        message: 'Company receipt not found',
        statusCode: 404,
      });
    }

    res.status(200).json(companyReceipt);
  } catch (err: ApiError | any) {
    console.error('Error fetching company receipt:', err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'Internal Server Error' });
  }
};

export const getCompanyReceiptsByCompanyId = async (
  req: Request,
  res: Response,
) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );
    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { companyId } = req.params;
    const companyReceipts = await prisma.companyReceipt.findMany({
      where: { companyId },
      include: {
        Company: true,
      },
    });

    if (companyReceipts.length === 0) {
      throw new ApiError({
        message: 'No receipts found for this company',
        statusCode: 404,
      });
    }

    res.status(200).json(companyReceipts);
  } catch (err: ApiError | any) {
    console.error('Error fetching company receipts:', err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'Internal Server Error' });
  }
};

export const updateCompanyReceipt = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );
    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;
    const updatedData = req.body;

    const companyReceipt = await prisma.companyReceipt.update({
      where: { id },
      data: updatedData,
      include: {
        Company: true,
      },
    });

    res.status(200).json(companyReceipt);
  } catch (err: ApiError | any) {
    console.error('Error updating company receipt:', err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'Internal Server Error' });
  }
};

export const deleteCompanyReceipt = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.MANAGEMENT_RIGHTS,
    );
    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    const { id } = req.params;

    const companyReceipt = await prisma.companyReceipt.findUnique({
      where: { id },
    });

    if (!companyReceipt) {
      throw new ApiError({
        message: 'Company receipt not found',
        statusCode: 404,
      });
    }

    await prisma.companyReceipt.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Company receipt deleted successfully' });
  } catch (err: ApiError | any) {
    console.error('Error deleting company receipt:', err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'Internal Server Error' });
  }
};

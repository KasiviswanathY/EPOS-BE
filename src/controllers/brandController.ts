import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType, Status } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const statusFilter = req.query.status as string;
    const validStatus =
      statusFilter && Object.values(Status).includes(statusFilter as Status)
        ? (statusFilter as Status)
        : undefined;

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        skip,
        take: pageSize,
        where: {
          status: validStatus,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.brand.count({
        where: {
          status: validStatus,
        },
      }),
    ]);

    res.status(200).json({
      data: brands,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching brands:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch brands',
    });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            salePrice: true,
            costPrice: true,
          },
        },
      },
    });

    if (!brand) {
      throw new ApiError({ message: 'Brand not found', statusCode: 404 });
    }

    res.status(200).json(brand);
  } catch (error: ApiError | any) {
    console.error('Error fetching brand:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch brand',
    });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { name, description, status, productOrderCode, articleCode } =
      req.body;

    if (!name) {
      throw new ApiError({
        message: 'Name is required',
        statusCode: 400,
      });
    }

    const existingBrand = await prisma.brand.findUnique({
      where: { name },
    });
    if (existingBrand) {
      throw new ApiError({
        message: 'Brand with this name already exists',
        statusCode: 409,
      });
    }

    if (productOrderCode) {
      const existingProductOrderCode = await prisma.brand.findUnique({
        where: { productOrderCode },
      });
      if (existingProductOrderCode) {
        throw new ApiError({
          message: 'Brand with this product order code already exists',
          statusCode: 409,
        });
      }
    }

    if (articleCode) {
      const existingArticleCode = await prisma.brand.findUnique({
        where: { articleCode },
      });
      if (existingArticleCode) {
        throw new ApiError({
          message: 'Brand with this article code already exists',
          statusCode: 409,
        });
      }
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        description,
        status,
        productOrderCode,
        articleCode,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(brand);
  } catch (error: ApiError | any) {
    console.error('Error creating brand:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create brand',
    });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { name, description, status, productOrderCode, articleCode } =
      req.body;

    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });
    if (!existingBrand) {
      throw new ApiError({ message: 'Brand not found', statusCode: 404 });
    }

    if (name && name !== existingBrand.name) {
      const duplicateName = await prisma.brand.findUnique({
        where: { name },
      });
      if (duplicateName) {
        throw new ApiError({
          message: 'Brand with this name already exists',
          statusCode: 409,
        });
      }
    }

    if (
      productOrderCode &&
      productOrderCode !== existingBrand.productOrderCode
    ) {
      const duplicateProductOrderCode = await prisma.brand.findUnique({
        where: { productOrderCode },
      });
      if (duplicateProductOrderCode) {
        throw new ApiError({
          message: 'Brand with this product order code already exists',
          statusCode: 409,
        });
      }
    }

    if (articleCode && articleCode !== existingBrand.articleCode) {
      const duplicateArticleCode = await prisma.brand.findUnique({
        where: { articleCode },
      });
      if (duplicateArticleCode) {
        throw new ApiError({
          message: 'Brand with this article code already exists',
          statusCode: 409,
        });
      }
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(productOrderCode !== undefined && { productOrderCode }),
        ...(articleCode !== undefined && { articleCode }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json(brand);
  } catch (error: ApiError | any) {
    console.error('Error updating brand:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to update brand',
    });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!brand) {
      throw new ApiError({ message: 'Brand not found', statusCode: 404 });
    }

    if (brand.product.length > 0) {
      throw new ApiError({
        message: 'Cannot delete brand with associated products',
        statusCode: 400,
      });
    }

    await prisma.brand.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting brand:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete brand',
    });
  }
};

import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType, WetOrDry } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: pageSize,
        where: {
          parentId: req.query.parentId
            ? (req.query.parentId as string)
            : undefined,
          showonTill: req.query.showonTill
            ? req.query.showonTill === 'true'
            : undefined,
        },
        include: {
          popupNote: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.category.count({
        where: {
          parentId: req.query.parentId
            ? (req.query.parentId as string)
            : undefined,
          showonTill: req.query.showonTill
            ? req.query.showonTill === 'true'
            : undefined,
        },
      }),
    ]);

    res.status(200).json({
      data: categories,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching categories:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch categories',
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        popupNote: true,
      },
    });

    if (!category) {
      throw new ApiError({ message: 'Category not found', statusCode: 404 });
    }

    res.status(200).json(category);
  } catch (error: ApiError | any) {
    console.error('Error fetching category:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch category',
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const {
      name,
      description,
      parentId,
      reportCategory,
      wetOrDry,
      showonTill,
      nominalCode,
      popupNoteId,
    } = req.body;

    if (!name) {
      throw new ApiError({
        message: 'Name is a required field',
        statusCode: 400,
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });
    if (existingCategory) {
      throw new ApiError({
        message: 'Category with this name already exists',
        statusCode: 409,
      });
    }

    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parentCategory) {
        throw new ApiError({
          message: 'Parent category not found',
          statusCode: 404,
        });
      }
    }

    // // Validate popupNoteId if provided
    // if (popupNoteId) {
    //   const popupNote = await prisma.popupNote.findUnique({
    //     where: { id: popupNoteId },
    //   });
    //   if (!popupNote) {
    //     throw new ApiError({
    //       message: 'Popup note not found',
    //       statusCode: 404,
    //     });
    //   }
    // }

    if (wetOrDry && !Object.values(WetOrDry).includes(wetOrDry)) {
      throw new ApiError({
        message: 'Invalid wetOrDry value. Must be WET or DRY',
        statusCode: 400,
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        parentId,
        reportCategory,
        wetOrDry: wetOrDry || WetOrDry.WET,
        showonTill: showonTill !== undefined ? showonTill : true,
        nominalCode,
        popupNoteId,
      },
      include: {
        popupNote: true,
      },
    });

    res.status(201).json(category);
  } catch (error: ApiError | any) {
    console.error('Error creating category:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create category',
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const {
      name,
      description,
      parentId,
      reportCategory,
      wetOrDry,
      showonTill,
      nominalCode,
      popupNoteId,
    } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      throw new ApiError({ message: 'Category not found', statusCode: 404 });
    }

    if (name && name !== existingCategory.name) {
      const duplicateName = await prisma.category.findUnique({
        where: { name },
      });
      if (duplicateName) {
        throw new ApiError({
          message: 'Category with this name already exists',
          statusCode: 409,
        });
      }
    }

    if (nominalCode && nominalCode !== existingCategory.nominalCode) {
      const duplicateNominalCode = await prisma.category.findUnique({
        where: { nominalCode },
      });
      if (duplicateNominalCode) {
        throw new ApiError({
          message: 'Category with this nominal code already exists',
          statusCode: 409,
        });
      }
    }

    if (parentId && parentId !== existingCategory.parentId) {
      if (parentId === id) {
        throw new ApiError({
          message: 'Category cannot be its own parent',
          statusCode: 400,
        });
      }

      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parentCategory) {
        throw new ApiError({
          message: 'Parent category not found',
          statusCode: 404,
        });
      }
    }

    if (popupNoteId && popupNoteId !== existingCategory.popupNoteId) {
      const popupNote = await prisma.popupNote.findUnique({
        where: { id: popupNoteId },
      });
      if (!popupNote) {
        throw new ApiError({
          message: 'Popup note not found',
          statusCode: 404,
        });
      }
    }

    if (wetOrDry && !Object.values(WetOrDry).includes(wetOrDry)) {
      throw new ApiError({
        message: 'Invalid wetOrDry value. Must be WET or DRY',
        statusCode: 400,
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(parentId !== undefined && { parentId }),
        ...(reportCategory !== undefined && { reportCategory }),
        ...(wetOrDry !== undefined && { wetOrDry }),
        ...(showonTill !== undefined && { showonTill }),
        ...(nominalCode !== undefined && { nominalCode }),
        ...(popupNoteId !== undefined && { popupNoteId }),
      },
      include: {
        popupNote: true,
      },
    });

    res.status(200).json(category);
  } catch (error: ApiError | any) {
    console.error('Error updating category:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to update category',
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        product: true,
        promotions: true,
      },
    });

    if (!category) {
      throw new ApiError({ message: 'Category not found', statusCode: 404 });
    }

    if (category.product.length > 0) {
      throw new ApiError({
        message: 'Cannot delete category with associated products',
        statusCode: 400,
      });
    }

    if (category.promotions.length > 0) {
      throw new ApiError({
        message: 'Cannot delete category with associated promotions',
        statusCode: 400,
      });
    }

    const childCategories = await prisma.category.findMany({
      where: { parentId: id },
    });

    if (childCategories.length > 0) {
      throw new ApiError({
        message: 'Cannot delete category with child categories',
        statusCode: 400,
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting category:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete category',
    });
  }
};

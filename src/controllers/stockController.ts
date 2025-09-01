import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType, StockMovementType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

const stockMovementInclude = {
  processedByUser: {
    select: {
      id: true,
      username: true,
    },
  },
  processedByStaff: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const getStocks = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [stocks, total] = await Promise.all([
      prisma.stock.findMany({
        skip,
        take: pageSize,
        where: {
          productId: req.query.productId
            ? (req.query.productId as string)
            : undefined,
          locationId: req.query.locationId
            ? (req.query.locationId as string)
            : undefined,
          isLowStock: req.query.lowStock === 'true' ? true : undefined,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              salePrice: true,
              costPrice: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
          stockMovements: {
            take: 5,
            orderBy: {
              createdAt: 'desc',
            },
            include: stockMovementInclude,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      prisma.stock.count({
        where: {
          productId: req.query.productId
            ? (req.query.productId as string)
            : undefined,
          locationId: req.query.locationId
            ? (req.query.locationId as string)
            : undefined,
          isLowStock: req.query.lowStock === 'true' ? true : undefined,
        },
      }),
    ]);

    res.status(200).json({
      data: stocks,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching stocks:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch stocks',
    });
  }
};

export const getStockById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            salePrice: true,
            costPrice: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        stockMovements: {
          orderBy: {
            createdAt: 'desc',
          },
          include: stockMovementInclude,
        },
      },
    });

    if (!stock) {
      throw new ApiError({
        message: 'Stock record not found',
        statusCode: 404,
      });
    }

    res.status(200).json(stock);
  } catch (error: ApiError | any) {
    console.error('Error fetching stock:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch stock',
    });
  }
};

export const createStock = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const {
      productId,
      locationId,
      quantity,
      minStockLevel = 0,
      maxStockLevel,
      reorderLevel = 0,
    } = req.body;

    if (
      !productId ||
      !locationId ||
      quantity === undefined ||
      quantity === null
    ) {
      throw new ApiError({
        message: 'Product ID, location ID, and quantity are required',
        statusCode: 400,
      });
    }

    if (quantity < 0) {
      throw new ApiError({
        message: 'Quantity cannot be negative',
        statusCode: 400,
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new ApiError({
        message: 'Product not found',
        statusCode: 404,
      });
    }

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location) {
      throw new ApiError({
        message: 'Location not found',
        statusCode: 404,
      });
    }

    const existingStock = await prisma.stock.findUnique({
      where: {
        productId_locationId: {
          productId,
          locationId,
        },
      },
    });
    if (existingStock) {
      throw new ApiError({
        message:
          'Stock record already exists for this product at this location',
        statusCode: 409,
      });
    }

    const isLowStock = minStockLevel > 0 && quantity <= minStockLevel;

    const stock = await prisma.stock.create({
      data: {
        productId,
        locationId,
        quantity,
        minStockLevel,
        maxStockLevel,
        reorderLevel,
        isLowStock,
        lastRestockDate: quantity > 0 ? new Date() : null,
        stockMovements: {
          create: {
            type: StockMovementType.INITIAL_STOCK,
            quantity,
            previousQuantity: 0,
            newQuantity: quantity,
            reason: 'Initial stock creation',
            processedByUserId: req.user?.id || '',
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            salePrice: true,
            costPrice: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        stockMovements: {
          include: stockMovementInclude,
        },
      },
    });

    res.status(201).json(stock);
  } catch (error: ApiError | any) {
    console.error('Error creating stock:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create stock',
    });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { minStockLevel, maxStockLevel, reorderLevel } = req.body;

    const allowedFields = ['minStockLevel', 'maxStockLevel', 'reorderLevel'];
    const providedFields = Object.keys(req.body);
    const invalidFields = providedFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new ApiError({
        message: `Cannot update the following fields: ${invalidFields.join(', ')}. Only minStockLevel, maxStockLevel, and reorderLevel can be updated.`,
        statusCode: 400,
      });
    }

    const existingStock = await prisma.stock.findUnique({
      where: { id },
    });
    if (!existingStock) {
      throw new ApiError({
        message: 'Stock record not found',
        statusCode: 404,
      });
    }

    const newMinStockLevel =
      minStockLevel !== undefined ? minStockLevel : existingStock.minStockLevel;
    const isLowStock =
      newMinStockLevel &&
      newMinStockLevel > 0 &&
      existingStock.quantity <= newMinStockLevel;

    const stock = await prisma.stock.update({
      where: { id },
      data: {
        ...(minStockLevel !== undefined && { minStockLevel }),
        ...(maxStockLevel !== undefined && { maxStockLevel }),
        ...(reorderLevel !== undefined && { reorderLevel }),
        isLowStock: isLowStock || false,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            salePrice: true,
            costPrice: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        stockMovements: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: stockMovementInclude,
        },
      },
    });

    res.status(200).json(stock);
  } catch (error: ApiError | any) {
    console.error('Error updating stock:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to update stock',
    });
  }
};

export const adjustStock = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { type, quantity, reason, reference } = req.body;

    if (!type || quantity === undefined || quantity === null) {
      throw new ApiError({
        message: 'Type and quantity are required',
        statusCode: 400,
      });
    }

    if (!Object.values(StockMovementType).includes(type as StockMovementType)) {
      throw new ApiError({
        message: 'Invalid stock movement type',
        statusCode: 400,
      });
    }

    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        product: true,
        location: true,
      },
    });

    if (!stock) {
      throw new ApiError({
        message: 'Stock record not found',
        statusCode: 404,
      });
    }

    const previousQuantity = stock.quantity;
    let newQuantity;

    if (
      type === StockMovementType.PURCHASE ||
      type === StockMovementType.TRANSFER_IN ||
      type === StockMovementType.RETURN
    ) {
      newQuantity = previousQuantity + quantity;
    }

    if (
      type === StockMovementType.SALE ||
      type === StockMovementType.TRANSFER_OUT ||
      type === StockMovementType.EXPIRED ||
      type === StockMovementType.DAMAGED
    ) {
      newQuantity = previousQuantity - quantity;
    }

    if (type === StockMovementType.ADJUSTMENT) newQuantity = quantity;

    if (newQuantity < 0) {
      throw new ApiError({
        message: 'Stock cannot go negative',
        statusCode: 400,
      });
    }

    const isLowStock =
      stock.minStockLevel &&
      stock.minStockLevel > 0 &&
      newQuantity <= stock.minStockLevel;
    const shouldUpdateRestockDate =
      quantity > 0 &&
      (type === StockMovementType.PURCHASE ||
        type === StockMovementType.TRANSFER_IN);

    const updatedStock = await prisma.stock.update({
      where: { id },
      data: {
        quantity: newQuantity,
        isLowStock: isLowStock || false,
        lastRestockDate: shouldUpdateRestockDate
          ? new Date()
          : stock.lastRestockDate,
        stockMovements: {
          create: {
            type: type as StockMovementType,
            quantity,
            previousQuantity,
            newQuantity,
            reason,
            reference,
            processedByUserId: req.user?.id || '',
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            salePrice: true,
            costPrice: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        stockMovements: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: stockMovementInclude,
        },
      },
    });

    res.status(200).json(updatedStock);
  } catch (error: ApiError | any) {
    console.error('Error adjusting stock:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to adjust stock',
    });
  }
};

export const deleteStock = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        stockMovements: true,
      },
    });

    if (!stock) {
      throw new ApiError({
        message: 'Stock record not found',
        statusCode: 404,
      });
    }

    if (stock.quantity > 0) {
      throw new ApiError({
        message:
          'Cannot delete stock record with remaining quantity. Adjust stock to zero first.',
        statusCode: 400,
      });
    }

    await prisma.stock.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Stock record deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting stock:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete stock',
    });
  }
};

export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [lowStockItems, total] = await Promise.all([
      prisma.stock.findMany({
        skip,
        take: pageSize,
        where: {
          isLowStock: true,
          locationId: req.query.locationId
            ? (req.query.locationId as string)
            : undefined,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              salePrice: true,
              costPrice: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          quantity: 'asc',
        },
      }),
      prisma.stock.count({
        where: {
          isLowStock: true,
          locationId: req.query.locationId
            ? (req.query.locationId as string)
            : undefined,
        },
      }),
    ]);

    res.status(200).json({
      data: lowStockItems,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching low stock items:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch low stock items',
    });
  }
};

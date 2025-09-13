import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType, StockMovementType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

// Common include for stock movement queries
const stockMovementInclude = {
  stock: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  processedByStaff: {
    select: {
      id: true,
      name: true,
    },
  },
  processedByUser: {
    select: {
      id: true,
      username: true,
    },
  },
};

export const getStockMovements = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    // Filters
    const type = req.query.type as string;
    const stockId = req.query.stockId as string;
    const productId = req.query.productId as string;
    const locationId = req.query.locationId as string;

    const filter: any = {};

    if (
      type &&
      Object.values(StockMovementType).includes(type as StockMovementType)
    ) {
      filter.type = type;
    }

    if (stockId) {
      filter.stockId = stockId;
    }

    // For product and location filtering, we need to join through the stock table
    let stockFilter = {};
    if (productId) {
      stockFilter = {
        ...stockFilter,
        productId,
      };
    }

    if (locationId) {
      stockFilter = {
        ...stockFilter,
        locationId,
      };
    }

    if (Object.keys(stockFilter).length > 0) {
      filter.stock = {
        is: stockFilter,
      };
    }

    const [stockMovements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        skip,
        take: pageSize,
        where: filter,
        include: stockMovementInclude,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.stockMovement.count({
        where: filter,
      }),
    ]);

    res.status(200).json({
      data: stockMovements,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching stock movements:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch stock movements',
    });
  }
};

export const getStockMovementById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const stockMovement = await prisma.stockMovement.findUnique({
      where: { id },
      include: stockMovementInclude,
    });

    if (!stockMovement) {
      throw new ApiError({
        message: 'Stock movement not found',
        statusCode: 404,
      });
    }

    res.status(200).json(stockMovement);
  } catch (error: ApiError | any) {
    console.error('Error fetching stock movement:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch stock movement',
    });
  }
};

export const createStockMovement = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const {
      type,
      quantity,
      reason,
      reference,
      stockId,
      processedByStaffId,
      processedByUserId,
    } = req.body;

    // Validate required fields
    if (!type || !quantity || !stockId) {
      throw new ApiError({
        message: 'Required fields: type, quantity, stockId',
        statusCode: 400,
      });
    }

    // Validate type is a valid StockMovementType
    if (!Object.values(StockMovementType).includes(type as StockMovementType)) {
      throw new ApiError({
        message: 'Invalid stock movement type',
        statusCode: 400,
      });
    }

    // Check if stock exists
    const stock = await prisma.stock.findUnique({
      where: { id: stockId },
    });

    if (!stock) {
      throw new ApiError({
        message: 'Stock not found',
        statusCode: 404,
      });
    }

    // Calculate the new quantity based on the movement type
    let newQuantity = stock.quantity;

    // Increase stock for these types
    if (
      type === StockMovementType.PURCHASE ||
      type === StockMovementType.TRANSFER_IN ||
      type === StockMovementType.RETURN ||
      (type === StockMovementType.ADJUSTMENT && quantity > 0)
    ) {
      newQuantity += Math.abs(quantity);
    }
    // Decrease stock for these types
    else if (
      type === StockMovementType.SALE ||
      type === StockMovementType.TRANSFER_OUT ||
      type === StockMovementType.EXPIRED ||
      type === StockMovementType.DAMAGED ||
      (type === StockMovementType.ADJUSTMENT && quantity < 0)
    ) {
      newQuantity -= Math.abs(quantity);
    }
    // Initial stock sets the stock to the specified quantity
    else if (type === StockMovementType.INITIAL_STOCK) {
      newQuantity = quantity;
    }

    // Ensure stock doesn't go negative
    if (newQuantity < 0) {
      throw new ApiError({
        message: 'Stock cannot be negative. Not enough items in stock.',
        statusCode: 400,
      });
    }

    // Create the stock movement and update stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the stock movement
      const stockMovement = await tx.stockMovement.create({
        data: {
          type: type as StockMovementType,
          quantity,
          previousQuantity: stock.quantity,
          newQuantity,
          reason,
          reference,
          stockId,
          processedByStaffId,
          processedByUserId: processedByUserId || req.user?.id,
        },
        include: stockMovementInclude,
      });

      // Update the stock quantity
      const isLowStock =
        stock.minStockLevel &&
        stock.minStockLevel > 0 &&
        newQuantity <= stock.minStockLevel;

      await tx.stock.update({
        where: { id: stockId },
        data: {
          quantity: newQuantity,
          isLowStock: isLowStock || false,
          ...(type === StockMovementType.PURCHASE && {
            lastRestockDate: new Date(),
          }),
        },
      });

      return stockMovement;
    });

    res.status(201).json(result);
  } catch (error: ApiError | any) {
    console.error('Error creating stock movement:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create stock movement',
    });
  }
};

export const bulkCreateStockMovements = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { movements } = req.body;

    if (!movements || !Array.isArray(movements) || movements.length === 0) {
      throw new ApiError({
        message: 'At least one stock movement is required',
        statusCode: 400,
      });
    }

    // Process each movement in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdMovements = [];

      for (const movement of movements) {
        const {
          type,
          quantity,
          reason,
          reference,
          stockId,
          processedByStaffId,
          processedByUserId,
        } = movement;

        // Validate required fields
        if (!type || !quantity || !stockId) {
          throw new ApiError({
            message:
              'Required fields for each movement: type, quantity, stockId',
            statusCode: 400,
          });
        }

        // Validate type is a valid StockMovementType
        if (
          !Object.values(StockMovementType).includes(type as StockMovementType)
        ) {
          throw new ApiError({
            message: `Invalid stock movement type: ${type}`,
            statusCode: 400,
          });
        }

        // Check if stock exists
        const stock = await tx.stock.findUnique({
          where: { id: stockId },
        });

        if (!stock) {
          throw new ApiError({
            message: `Stock not found with ID: ${stockId}`,
            statusCode: 404,
          });
        }

        // Calculate the new quantity based on the movement type
        let newQuantity = stock.quantity;

        // Increase stock for these types
        if (
          type === StockMovementType.PURCHASE ||
          type === StockMovementType.TRANSFER_IN ||
          type === StockMovementType.RETURN ||
          (type === StockMovementType.ADJUSTMENT && quantity > 0)
        ) {
          newQuantity += Math.abs(quantity);
        }
        // Decrease stock for these types
        else if (
          type === StockMovementType.SALE ||
          type === StockMovementType.TRANSFER_OUT ||
          type === StockMovementType.EXPIRED ||
          type === StockMovementType.DAMAGED ||
          (type === StockMovementType.ADJUSTMENT && quantity < 0)
        ) {
          newQuantity -= Math.abs(quantity);
        }
        // Initial stock sets the stock to the specified quantity
        else if (type === StockMovementType.INITIAL_STOCK) {
          newQuantity = quantity;
        }

        // Ensure stock doesn't go negative
        if (newQuantity < 0) {
          throw new ApiError({
            message: `Stock cannot be negative for product in stock ID: ${stockId}. Not enough items in stock.`,
            statusCode: 400,
          });
        }

        // Create the stock movement
        const stockMovement = await tx.stockMovement.create({
          data: {
            type: type as StockMovementType,
            quantity,
            previousQuantity: stock.quantity,
            newQuantity,
            reason,
            reference,
            stockId,
            processedByStaffId,
            processedByUserId: processedByUserId || req.user?.id,
          },
          include: stockMovementInclude,
        });

        // Update the stock quantity
        const isLowStock =
          stock.minStockLevel &&
          stock.minStockLevel > 0 &&
          newQuantity <= stock.minStockLevel;

        await tx.stock.update({
          where: { id: stockId },
          data: {
            quantity: newQuantity,
            isLowStock: isLowStock || false,
            ...(type === StockMovementType.PURCHASE && {
              lastRestockDate: new Date(),
            }),
          },
        });

        createdMovements.push(stockMovement);
      }

      return createdMovements;
    });

    res.status(201).json({
      count: result.length,
      movements: result,
    });
  } catch (error: ApiError | any) {
    console.error('Error creating bulk stock movements:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create bulk stock movements',
    });
  }
};

export const updateStockMovement = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { reason, reference } = req.body;

    // Only allow updating certain fields
    const allowedFields = ['reason', 'reference'];
    const providedFields = Object.keys(req.body);
    const invalidFields = providedFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new ApiError({
        message: `Cannot update the following fields: ${invalidFields.join(', ')}. Only reason and reference can be updated.`,
        statusCode: 400,
      });
    }

    // Check if stock movement exists
    const existingMovement = await prisma.stockMovement.findUnique({
      where: { id },
    });

    if (!existingMovement) {
      throw new ApiError({
        message: 'Stock movement not found',
        statusCode: 404,
      });
    }

    // Update the stock movement
    const updatedMovement = await prisma.stockMovement.update({
      where: { id },
      data: {
        reason,
        reference,
      },
      include: stockMovementInclude,
    });

    res.status(200).json(updatedMovement);
  } catch (error: ApiError | any) {
    console.error('Error updating stock movement:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to update stock movement',
    });
  }
};

export const deleteStockMovement = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    // Check if stock movement exists
    const existingMovement = await prisma.stockMovement.findUnique({
      where: { id },
    });

    if (!existingMovement) {
      throw new ApiError({
        message: 'Stock movement not found',
        statusCode: 404,
      });
    }

    // Only allow deleting recent movements (e.g., within the last 24 hours)
    const moveDate = new Date(existingMovement.createdAt);
    const now = new Date();
    const hoursElapsed =
      (now.getTime() - moveDate.getTime()) / (1000 * 60 * 60);

    if (hoursElapsed > 24) {
      throw new ApiError({
        message: 'Cannot delete stock movements older than 24 hours',
        statusCode: 400,
      });
    }

    // Get the stock
    const stock = await prisma.stock.findUnique({
      where: { id: existingMovement.stockId },
    });

    if (!stock) {
      throw new ApiError({
        message: 'Associated stock not found',
        statusCode: 404,
      });
    }

    // Calculate the revised quantity
    let revisedQuantity = stock.quantity;

    // Reverse the effect of the movement
    if (
      existingMovement.type === StockMovementType.PURCHASE ||
      existingMovement.type === StockMovementType.TRANSFER_IN ||
      existingMovement.type === StockMovementType.RETURN ||
      (existingMovement.type === StockMovementType.ADJUSTMENT &&
        existingMovement.quantity > 0)
    ) {
      // This increased stock, so decrease it
      revisedQuantity -= Math.abs(existingMovement.quantity);
    } else if (
      existingMovement.type === StockMovementType.SALE ||
      existingMovement.type === StockMovementType.TRANSFER_OUT ||
      existingMovement.type === StockMovementType.EXPIRED ||
      existingMovement.type === StockMovementType.DAMAGED ||
      (existingMovement.type === StockMovementType.ADJUSTMENT &&
        existingMovement.quantity < 0)
    ) {
      // This decreased stock, so increase it
      revisedQuantity += Math.abs(existingMovement.quantity);
    }
    // Initial stock - revert to 0 if it was the first movement
    else if (existingMovement.type === StockMovementType.INITIAL_STOCK) {
      // Check if this is the only movement
      const movementCount = await prisma.stockMovement.count({
        where: { stockId: existingMovement.stockId },
      });

      if (movementCount === 1) {
        revisedQuantity = 0;
      } else {
        throw new ApiError({
          message:
            'Cannot delete initial stock movement if subsequent movements exist',
          statusCode: 400,
        });
      }
    }

    // Ensure stock doesn't go negative
    if (revisedQuantity < 0) {
      throw new ApiError({
        message:
          'Cannot delete this movement as it would result in negative stock',
        statusCode: 400,
      });
    }

    // Delete the movement and update stock in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the stock movement
      await tx.stockMovement.delete({
        where: { id },
      });

      // Update the stock quantity
      const isLowStock =
        stock.minStockLevel &&
        stock.minStockLevel > 0 &&
        revisedQuantity <= stock.minStockLevel;

      await tx.stock.update({
        where: { id: existingMovement.stockId },
        data: {
          quantity: revisedQuantity,
          isLowStock: isLowStock || false,
        },
      });
    });

    res.status(200).json({ message: 'Stock movement deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting stock movement:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete stock movement',
    });
  }
};

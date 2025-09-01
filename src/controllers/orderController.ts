import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import {
  UserPermissionType,
  OrderStatus,
  PaymentStatus,
  StockMovementType,
} from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

const orderProcessorInclude = {
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

export const getOrders = async (req: Request, res: Response) => {
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
      statusFilter &&
      Object.values(OrderStatus).includes(statusFilter as OrderStatus)
        ? (statusFilter as OrderStatus)
        : undefined;

    const paymentStatusFilter = req.query.paymentStatus as string;
    const validPaymentStatus =
      paymentStatusFilter &&
      Object.values(PaymentStatus).includes(
        paymentStatusFilter as PaymentStatus,
      )
        ? (paymentStatusFilter as PaymentStatus)
        : undefined;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: pageSize,
        where: {
          status: validStatus,
          paymentStatus: validPaymentStatus,
          customerId: req.query.customerId
            ? (req.query.customerId as string)
            : undefined,
          locationId: req.query.locationId
            ? (req.query.locationId as string)
            : undefined,
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
          ...orderProcessorInclude,
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  salePrice: true,
                },
              },
            },
          },
        },
        orderBy: {
          orderDate: 'desc',
        },
      }),
      prisma.order.count({
        where: {
          status: validStatus,
          paymentStatus: validPaymentStatus,
          customerId: req.query.customerId
            ? (req.query.customerId as string)
            : undefined,
          locationId: req.query.locationId
            ? (req.query.locationId as string)
            : undefined,
        },
      }),
    ]);

    res.status(200).json({
      data: orders,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching orders:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch orders',
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            contactNumber: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        ...orderProcessorInclude,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                salePrice: true,
              },
            },
            promotions: {
              select: {
                id: true,
                name: true,
                discountAmount: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new ApiError({ message: 'Order not found', statusCode: 404 });
    }

    res.status(200).json(order);
  } catch (error: ApiError | any) {
    console.error('Error fetching order:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch order',
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const {
      totalAmount,
      subTotal,
      taxAmount,
      discountAmount = 0.0,
      finalAmount,
      paymentMethod,
      paymentStatus = PaymentStatus.PENDING,
      notes,
      customerId,
      locationId,
      processedById,
      orderItems,
    } = req.body;

    if (
      !totalAmount ||
      !subTotal ||
      !taxAmount ||
      !finalAmount ||
      !paymentMethod ||
      !locationId ||
      !processedById ||
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      throw new ApiError({
        message:
          'Required fields: totalAmount, subTotal, taxAmount, finalAmount, paymentMethod, locationId, processedById, and orderItems (non-empty array)',
        statusCode: 400,
      });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location) {
      throw new ApiError({
        message: 'Location not found',
        statusCode: 404,
      });
    }

    const staff = await prisma.staff.findUnique({
      where: { id: processedById },
    });
    if (!staff) {
      throw new ApiError({
        message: 'Staff member not found',
        statusCode: 404,
      });
    }

    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        throw new ApiError({
          message: 'Customer not found',
          statusCode: 404,
        });
      }
    }

    const productIds = orderItems.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new ApiError({
        message: 'One or more products not found',
        statusCode: 404,
      });
    }

    const stockChecks = await Promise.all(
      orderItems.map(async (item: any) => {
        const stock = await prisma.stock.findUnique({
          where: {
            productId_locationId: {
              productId: item.productId,
              locationId: locationId,
            },
          },
        });

        if (!stock) {
          throw new ApiError({
            message: `No stock record found for product ${item.productId} at location ${locationId}`,
            statusCode: 400,
          });
        }

        if (stock.quantity < item.quantity) {
          const product = products.find((p) => p.id === item.productId);
          throw new ApiError({
            message: `Insufficient stock for product "${product?.name}". Available: ${stock.quantity}, Requested: ${item.quantity}`,
            statusCode: 400,
          });
        }

        return { stock, item };
      }),
    );

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          totalAmount,
          subTotal,
          taxAmount,
          discountAmount,
          finalAmount,
          paymentMethod,
          paymentStatus,
          notes,
          customerId,
          locationId,
          processedByStaffId: processedById,
          orderItems: {
            create: orderItems.map((item: any) => ({
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              discountAmount: item.discountAmount || 0.0,
              taxAmount: item.taxAmount || 0.0,
              finalAmount: item.finalAmount,
              productId: item.productId,
            })),
          },
        },
      });

      for (const { stock, item } of stockChecks) {
        const newQuantity = stock.quantity - item.quantity;
        const isLowStock =
          stock.minStockLevel &&
          stock.minStockLevel > 0 &&
          newQuantity <= stock.minStockLevel;

        await tx.stock.update({
          where: { id: stock.id },
          data: {
            quantity: newQuantity,
            isLowStock: isLowStock || false,
            stockMovements: {
              create: {
                type: StockMovementType.SALE,
                quantity: item.quantity,
                previousQuantity: stock.quantity,
                newQuantity: newQuantity,
                reason: `Sale - Order ${orderNumber}`,
                reference: orderNumber,
                processedByUserId: req.user?.id || '',
              },
            },
          },
        });
      }

      return newOrder;
    });

    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        ...orderProcessorInclude,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(completeOrder);
  } catch (error: ApiError | any) {
    console.error('Error creating order:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create order',
    });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const allowedFields = ['status', 'paymentStatus', 'notes'];
    const providedFields = Object.keys(req.body);
    const invalidFields = providedFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new ApiError({
        message: `Cannot update the following fields: ${invalidFields.join(', ')}. Only status, paymentStatus, and notes can be updated.`,
        statusCode: 400,
      });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!existingOrder) {
      throw new ApiError({ message: 'Order not found', statusCode: 404 });
    }

    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new ApiError({
        message: 'Invalid order status',
        statusCode: 400,
      });
    }

    if (
      paymentStatus &&
      !Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)
    ) {
      throw new ApiError({
        message: 'Invalid payment status',
        statusCode: 400,
      });
    }

    // Check if order is being cancelled and restore stock
    const isCancelling =
      status === OrderStatus.CANCELLED &&
      existingOrder.status !== OrderStatus.CANCELLED;

    let order;
    if (isCancelling) {
      // Use transaction to restore stock when cancelling
      order = await prisma.$transaction(async (tx) => {
        // Update the order
        const updatedOrder = await tx.order.update({
          where: { id },
          data: {
            ...(status !== undefined && { status }),
            ...(paymentStatus !== undefined && { paymentStatus }),
            ...(notes !== undefined && { notes }),
          },
        });

        // Restore stock for each order item
        for (const orderItem of existingOrder.orderItems) {
          const stock = await tx.stock.findUnique({
            where: {
              productId_locationId: {
                productId: orderItem.productId,
                locationId: existingOrder.locationId,
              },
            },
          });

          if (stock) {
            const newQuantity = stock.quantity + orderItem.quantity;
            const isLowStock =
              stock.minStockLevel &&
              stock.minStockLevel > 0 &&
              newQuantity <= stock.minStockLevel;

            await tx.stock.update({
              where: { id: stock.id },
              data: {
                quantity: newQuantity,
                isLowStock: isLowStock || false,
                stockMovements: {
                  create: {
                    type: StockMovementType.RETURN,
                    quantity: orderItem.quantity,
                    previousQuantity: stock.quantity,
                    newQuantity: newQuantity,
                    reason: `Order cancelled - ${existingOrder.orderNumber}`,
                    reference: existingOrder.orderNumber,
                    processedByUserId: req.user?.id || '',
                  },
                },
              },
            });
          }
        }

        return updatedOrder;
      });
    } else {
      // Regular update without stock changes
      order = await prisma.order.update({
        where: { id },
        data: {
          ...(status !== undefined && { status }),
          ...(paymentStatus !== undefined && { paymentStatus }),
          ...(notes !== undefined && { notes }),
        },
      });
    }

    // Fetch complete order with relations
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        ...orderProcessorInclude,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(completeOrder);
  } catch (error: ApiError | any) {
    console.error('Error updating order:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to update order',
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new ApiError({ message: 'Order not found', statusCode: 404 });
    }

    if (
      order.status === OrderStatus.COMPLETED ||
      order.paymentStatus === PaymentStatus.PAID
    ) {
      throw new ApiError({
        message: 'Cannot delete completed or paid orders',
        statusCode: 400,
      });
    }

    await prisma.order.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting order:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete order',
    });
  }
};

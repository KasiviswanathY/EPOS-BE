import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType, UnitOfSale } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: pageSize,
        where: {
          categoryId: req.body?.categoryId ? req.body?.categoryId : undefined,
          brandId: req.body?.brandId ? req.body?.brandId : undefined,
        },
        include: {
          category: true,
          brand: true,
          taxRate: true,
          barCode: true,
          productTag: true,
          containerFee: true,
          mulitChoiceProductGroup: true,
          promotions: true,
        },
      }),
      prisma.product.count(),
    ]);

    res.status(200).json({
      data: products,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: ApiError | any) {
    console.error('Error fetching products:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch products',
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        taxRate: true,
        barCode: true,
        productTag: true,
        containerFee: true,
        mulitChoiceProductGroup: true,
        promotions: true,
      },
    });

    if (!product) {
      throw new ApiError({ message: 'Product not found', statusCode: 404 });
    }

    res.status(200).json(product);
  } catch (error: ApiError | any) {
    console.error('Error fetching product:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch product',
    });
  }
};

export const getProductByBarCode = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );
    if (!hasPermission) throw new UnauthorizedError();
    const { barCode } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        barCode: {
          code: barCode,
        },
      },
      include: {
        category: true,
        brand: true,
        taxRate: true,
        barCode: true,
        productTag: true,
        containerFee: true,
        mulitChoiceProductGroup: true,
      },
    });
    if (!product) {
      throw new ApiError({ message: 'Product not found', statusCode: 404 });
    }
    res.status(200).json(product);
  } catch (error: ApiError | any) {
    console.error('Error fetching product by barcode:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch product by barcode',
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const {
      name,
      description,
      costPrice,
      salePrice,
      unitOfSale,
      rating,
      sellOnPos,
      sellOnTill,
      rrp,
      variablePrice,
      taxExempt,
      warranty,
      manufacturer,
      manufactureDate,
      expiryDate,
      posOrder,
      buttonColor,
      scannableOnly,
      orderQuantityLimit,
      volumeOfSale,
      categoryId,
      brandId,
      taxRateId,
      barCodeId,
      productTagId,
      containerFeeId,
      mulitChoiceProductGroupId,
    } = req.body;

    if (!name || !salePrice || !costPrice || !unitOfSale) {
      throw new ApiError({
        message:
          'Name, salePrice, costPrice, and unit of sale are required fields',
        statusCode: 400,
      });
    }

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists)
        throw new ApiError({ message: 'Category not found', statusCode: 404 });
    }

    if (brandId) {
      const brandExists = await prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!brandExists)
        throw new ApiError({ message: 'Brand not found', statusCode: 404 });
    }

    if (taxRateId) {
      const taxRateExists = await prisma.taxRate.findUnique({
        where: { id: taxRateId },
      });
      if (!taxRateExists)
        throw new ApiError({ message: 'Tax rate not found', statusCode: 404 });
    }

    if (unitOfSale && !Object.values(UnitOfSale).includes(unitOfSale)) {
      throw new ApiError({ message: 'Invalid unit of sale', statusCode: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        costPrice,
        salePrice,
        unitOfSale,
        rating,
        sellOnPos,
        sellOnTill,
        rrp,
        variablePrice,
        taxExempt,
        warranty,
        manufacturer,
        manufactureDate,
        expiryDate,
        posOrder,
        buttonColor,
        scannableOnly,
        orderQuantityLimit,
        volumeOfSale,
        categoryId,
        brandId,
        taxRateId,
        barCodeId,
        productTagId,
        containerFeeId,
        mulitChoiceProductGroupId,
      },
      include: {
        category: true,
        brand: true,
        taxRate: true,
        barCode: true,
        productTag: true,
        containerFee: true,
        mulitChoiceProductGroup: true,
      },
    });

    res.status(201).json(product);
  } catch (error: ApiError | any) {
    console.error('Error creating product:', error);
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to create product',
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
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
      costPrice,
      salePrice,
      rating,
      sellOnPos,
      sellOnTill,
      rrp,
      variablePrice,
      taxExempt,
      warranty,
      manufacturer,
      manufactureDate,
      expiryDate,
      posOrder,
      buttonColor,
      scannableOnly,
      orderQuantityLimit,
      unitOfSale,
      volumeOfSale,
      categoryId,
      brandId,
      taxRateId,
      barCodeId,
      productTagId,
      containerFeeId,
      mulitChoiceProductGroupId,
    } = req.body;

    const productExists = await prisma.product.findUnique({ where: { id } });
    if (!productExists) {
      throw new ApiError({
        message: `Product with ID ${id} not found`,
        statusCode: 404,
      });
    }

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists)
        throw new ApiError({ message: 'Category not found', statusCode: 404 });
    }

    if (brandId) {
      const brandExists = await prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!brandExists)
        throw new ApiError({ message: 'Brand not found', statusCode: 404 });
    }

    if (taxRateId) {
      const taxRateExists = await prisma.taxRate.findUnique({
        where: { id: taxRateId },
      });
      if (!taxRateExists)
        throw new ApiError({ message: 'Tax rate not found', statusCode: 404 });
    }

    if (unitOfSale && !Object.values(UnitOfSale).includes(unitOfSale)) {
      throw new ApiError({ message: 'Invalid unit of sale', statusCode: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        costPrice,
        salePrice,
        rating,
        sellOnPos,
        sellOnTill,
        rrp,
        variablePrice,
        taxExempt,
        warranty,
        manufacturer,
        manufactureDate,
        expiryDate,
        posOrder,
        buttonColor,
        scannableOnly,
        orderQuantityLimit,
        unitOfSale,
        volumeOfSale,
        categoryId,
        brandId,
        taxRateId,
        barCodeId,
        productTagId,
        containerFeeId,
        mulitChoiceProductGroupId,
      },
      include: {
        category: true,
        brand: true,
        taxRate: true,
        barCode: true,
        productTag: true,
        containerFee: true,
        mulitChoiceProductGroup: true,
      },
    });

    res.status(200).json(product);
  } catch (error: ApiError | any) {
    console.error('Error updating product:', error);
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to update product',
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { id } = req.params;
    const productExists = await prisma.product.findUnique({ where: { id } });

    if (!productExists) {
      throw new ApiError({
        message: `Product with ID ${id} not found`,
        statusCode: 404,
      });
    }

    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting product:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete product',
    });
  }
};

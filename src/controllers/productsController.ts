import { Request, Response } from 'express';
import { prisma } from '../primsaClient'; // Adjust the import path as
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';

export const getProductById = async (request: Request, response: Response) => {
  try {
    const checkUserPermissions = checkPermissions(
      request.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!checkUserPermissions) {
      response.status(403).json({
        error: 'Forbidden: You do not have permission to access this resource.',
      });
      return;
    }

    const { id } = request.params;
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    response.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    response.status(500).json({ error: 'Error fetching product' });
  }
};

export const getProducts = async (request: Request, response: Response) => {
  try {
    const checkUserPermissions =
      request.user?.permissions?.includes('READ_PRODUCT');

    if (!checkUserPermissions) {
      response.status(403).json({
        error: 'Forbidden: You do not have permission to access this resource.',
      });
      return;
    }

    const products = await prisma.product.findMany({});
    response.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).json({ error: 'Error fetching products' });
  }
};

export const createProduct = async (request: Request, response: Response) => {
  try {
    const checkUserPermissions = checkPermissions(
      request.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!checkUserPermissions) {
      response.status(403).json({
        error: 'Forbidden: You do not have permission to access this resource.',
      });
      return;
    }

    const { name, salePrice, description } = request.body;
    const newProduct = await prisma.product.create({
      data: {
        name,
        salePrice,
        costPrice: salePrice,
        description,
        unit: 'pcs',
      },
    });

    response.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    response.status(500).json({ error: 'Error creating product' });
  }
};

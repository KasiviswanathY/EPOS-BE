import { Request, Response } from 'express';
import { prisma } from '../primsaClient'; // Adjust the import path as

export const getProductById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const product = await prisma.product.findUnique({
      where: {
        productId: id,
      },
    });

    response.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

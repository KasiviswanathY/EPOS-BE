import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Add Express multer type definitions
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
    interface Request {
      file?: Multer.File;
      files?:
        | {
            [fieldname: string]: Multer.File[];
          }
        | Multer.File[];
    }
  }
}

// This is a temporary workaround until Prisma client is regenerated
// @ts-ignore
const prismaWithProductImage = prisma as any;

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const tempDir = path.join(__dirname, '../../temp');
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter to only allow image files
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

// For handling multiple images (up to 5)
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB max file size, max 5 files
});

/**
 * Upload a new image for a product
 */
export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { productId } = req.params;
    const { isPrimary, altText, sortOrder } = req.body;

    // Check if product exists
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      throw new ApiError({
        message: `Product with ID ${productId} not found`,
        statusCode: 404,
      });
    }

    if (!req.file) {
      throw new ApiError({
        message: 'No image file uploaded',
        statusCode: 400,
      });
    }

    // Read the file from temp storage
    const imageBuffer = fs.readFileSync(req.file.path);

    // If this is marked as primary, set all other images to non-primary
    if (isPrimary === 'true' || isPrimary === true) {
      await prismaWithProductImage.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    // Create the image record in the database
    const productImage = await prismaWithProductImage.productImage.create({
      data: {
        productId,
        imageData: imageBuffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        isPrimary: isPrimary === 'true' || isPrimary === true,
        altText: altText || req.file.originalname,
        sortOrder: sortOrder ? parseInt(sortOrder as string) : 0,
      },
    });

    // Clean up the temp file
    fs.unlinkSync(req.file.path);

    // Return the image record (without binary data)
    const { imageData, ...imageInfo } = productImage;
    res.status(201).json({
      ...imageInfo,
      imageUrl: `/api/v1/products/${productId}/images/${productImage.id}`,
    });
  } catch (error: ApiError | any) {
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error uploading product image:', error);
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to upload product image',
    });
  }
};

/**
 * Get all images for a product
 */
export const getProductImages = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { productId } = req.params;

    // Check if product exists
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      throw new ApiError({
        message: `Product with ID ${productId} not found`,
        statusCode: 404,
      });
    }

    // Get all images for the product (without binary data)
    const images = await prismaWithProductImage.productImage.findMany({
      where: { productId },
      orderBy: [
        { isPrimary: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
      select: {
        id: true,
        fileName: true,
        contentType: true,
        fileSize: true,
        isPrimary: true,
        altText: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Add image URLs
    const imagesWithUrls = images.map((image: any) => ({
      ...image,
      imageUrl: `/api/v1/products/${productId}/images/${image.id}`,
    }));

    res.status(200).json(imagesWithUrls);
  } catch (error: ApiError | any) {
    console.error('Error fetching product images:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch product images',
    });
  }
};

/**
 * Get a specific image for a product
 */
export const getProductImage = async (req: Request, res: Response) => {
  try {
    const { productId, imageId } = req.params;

    // Find the image
    const image = await prismaWithProductImage.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!image) {
      throw new ApiError({
        message: 'Image not found',
        statusCode: 404,
      });
    }

    // Set content type header
    res.setHeader('Content-Type', image.contentType);
    res.setHeader('Content-Length', image.fileSize);

    // Send the image data
    res.status(200).send(image.imageData);
  } catch (error: ApiError | any) {
    console.error('Error fetching product image:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch product image',
    });
  }
};

/**
 * Update image metadata
 */
export const updateProductImage = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { productId, imageId } = req.params;
    const { isPrimary, altText, sortOrder } = req.body;

    // Check if image exists
    const imageExists = await prismaWithProductImage.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!imageExists) {
      throw new ApiError({
        message: 'Image not found',
        statusCode: 404,
      });
    }

    // If setting as primary, update all other images to non-primary
    if (isPrimary === 'true' || isPrimary === true) {
      await prismaWithProductImage.productImage.updateMany({
        where: {
          productId,
          id: { not: imageId },
        },
        data: { isPrimary: false },
      });
    }

    // Update the image metadata
    const updatedImage = await prismaWithProductImage.productImage.update({
      where: { id: imageId },
      data: {
        isPrimary: isPrimary === 'true' || isPrimary === true,
        altText,
        sortOrder: sortOrder ? parseInt(sortOrder as string) : undefined,
      },
      select: {
        id: true,
        fileName: true,
        contentType: true,
        fileSize: true,
        isPrimary: true,
        altText: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      ...updatedImage,
      imageUrl: `/api/v1/products/${productId}/images/${imageId}`,
    });
  } catch (error: ApiError | any) {
    console.error('Error updating product image:', error);
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to update product image',
    });
  }
};

/**
 * Delete a product image
 */
export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    const { productId, imageId } = req.params;

    // Check if image exists
    const imageExists = await prismaWithProductImage.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!imageExists) {
      throw new ApiError({
        message: 'Image not found',
        statusCode: 404,
      });
    }

    // Delete the image
    await prismaWithProductImage.productImage.delete({
      where: { id: imageId },
    });

    // If this was the primary image, set the next image as primary
    if (imageExists.isPrimary) {
      const nextImage = await prismaWithProductImage.productImage.findFirst({
        where: { productId },
        orderBy: { createdAt: 'asc' },
      });

      if (nextImage) {
        await prismaWithProductImage.productImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error: ApiError | any) {
    console.error('Error deleting product image:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to delete product image',
    });
  }
};

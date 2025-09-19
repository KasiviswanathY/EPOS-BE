import { Request, Response } from 'express';
import { prisma } from '../primsaClient';
import { checkPermissions } from '../utils/checkPermissions';
import { UserPermissionType, UnitOfSale } from '@prisma/client';
import { UnauthorizedError } from '../types/UnauthorizedError';
import { ApiError } from '../types/Error';
import fs from 'fs';

// This is a temporary workaround until Prisma client is regenerated
// @ts-ignore
const prismaWithProductImage = prisma as any;

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
          productTag: true,
          containerFee: true,
          mulitChoiceProductGroup: true,
          promotions: true,

          images: {
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
            orderBy: [
              { isPrimary: 'desc' },
              { sortOrder: 'asc' },
              { createdAt: 'asc' },
            ],
          },
        },
      }),
      prisma.product.count(),
    ]);

    // Add image URLs to each product's images
    if (products && products.length > 0) {
      products.forEach((product) => {
        if (product.images && product.images.length > 0) {
          // @ts-ignore
          product.images = product.images.map((image) => ({
            ...image,
            imageUrl: `/api/v1/products/${product.id}/images/${image.id}`,
          }));
        }
      });
    }

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
        // @ts-ignore - Will be fixed after prisma generate
        images: {
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
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
    });

    if (!product) {
      throw new ApiError({ message: 'Product not found', statusCode: 404 });
    }

    // Add image URLs to the product's images
    if (product.images && product.images.length > 0) {
      // @ts-ignore
      product.images = product.images.map((image) => ({
        ...image,
        imageUrl: `/api/v1/products/${product.id}/images/${image.id}`,
      }));
    }

    res.status(200).json(product);
  } catch (error: ApiError | any) {
    console.error('Error fetching product:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch product',
    });
  }
};

// Helper function to clean up temp files
const cleanupTempFiles = (files: Express.Multer.File[] | undefined) => {
  if (!files) return;

  files.forEach((file) => {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const hasPermission = checkPermissions(
      req.user,
      UserPermissionType.PRODUCT_RIGHTS,
    );

    if (!hasPermission) throw new UnauthorizedError();

    // Parse product data from the form or JSON body
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
      productTagId,
      containerFeeId,
      mulitChoiceProductGroupId,
      // Image specific fields - will be processed as arrays for multiple images
      isPrimaryImage,
      imageAltText,
    } = req.body;

    if (!name || !salePrice || !costPrice || !unitOfSale) {
      // Clean up temp files if they exist
      cleanupTempFiles(req.files as Express.Multer.File[]);

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
      if (!categoryExists) {
        // Clean up temp files if they exist
        cleanupTempFiles(req.files as Express.Multer.File[]);
        throw new ApiError({ message: 'Category not found', statusCode: 404 });
      }
    }

    if (brandId) {
      const brandExists = await prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!brandExists) {
        // Clean up temp files if they exist
        cleanupTempFiles(req.files as Express.Multer.File[]);
        throw new ApiError({ message: 'Brand not found', statusCode: 404 });
      }
    }

    if (taxRateId) {
      const taxRateExists = await prisma.taxRate.findUnique({
        where: { id: taxRateId },
      });
      if (!taxRateExists) {
        // Clean up temp files if they exist
        cleanupTempFiles(req.files as Express.Multer.File[]);
        throw new ApiError({ message: 'Tax rate not found', statusCode: 404 });
      }
    }

    if (unitOfSale && !Object.values(UnitOfSale).includes(unitOfSale)) {
      // Clean up temp files if they exist
      cleanupTempFiles(req.files as Express.Multer.File[]);
      throw new ApiError({ message: 'Invalid unit of sale', statusCode: 400 });
    }

    // Check if posOrder is provided and if it already exists
    if (posOrder) {
      const existingProduct = await prisma.product.findFirst({
        where: { posOrder },
      });

      if (existingProduct) {
        // Clean up temp files if they exist
        cleanupTempFiles(req.files as Express.Multer.File[]);
        throw new ApiError({
          message:
            'A product with this POS order already exists. POS order must be unique.',
          statusCode: 400,
        });
      }
    }

    // Process data for numeric values
    const numericCostPrice = parseFloat(costPrice as string);
    const numericSalePrice = parseFloat(salePrice as string);

    if (isNaN(numericCostPrice) || isNaN(numericSalePrice)) {
      // Clean up temp files if they exist
      cleanupTempFiles(req.files as Express.Multer.File[]);
      throw new ApiError({ message: 'Invalid price values', statusCode: 400 });
    }

    // Create the product first, without using a transaction
    const product = await prisma.product.create({
      data: {
        name,
        description,
        costPrice: numericCostPrice,
        salePrice: numericSalePrice,
        unitOfSale,
        rating: rating ? parseFloat(rating as string) : undefined,
        sellOnPos: sellOnPos === 'true' || sellOnPos === true,
        sellOnTill: sellOnTill === 'true' || sellOnTill === true,
        rrp: rrp ? parseFloat(rrp as string) : undefined,
        variablePrice: variablePrice === 'true' || variablePrice === true,
        taxExempt: taxExempt === 'true' || taxExempt === true,
        warranty: warranty ? parseInt(warranty as string) : undefined,
        manufacturer,
        manufactureDate: manufactureDate
          ? new Date(manufactureDate as string)
          : undefined,
        expiryDate: expiryDate ? new Date(expiryDate as string) : undefined,
        posOrder,
        buttonColor,
        scannableOnly: scannableOnly === 'true' || scannableOnly === true,
        orderQuantityLimit: orderQuantityLimit
          ? parseInt(orderQuantityLimit as string)
          : 100,
        volumeOfSale: volumeOfSale ? parseFloat(volumeOfSale as string) : 1.0,
        categoryId,
        brandId,
        taxRateId,
        productTagId,
        containerFeeId,
        mulitChoiceProductGroupId,
      },
    });

    // Confirm product was created successfully
    if (!product || !product.id) {
      // Clean up temp files if they exist
      cleanupTempFiles(req.files as Express.Multer.File[]);
      throw new ApiError({
        message: 'Failed to create product',
        statusCode: 500,
      });
    }

    // Process images separately after product is confirmed to exist
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      // Get the arrays of image attributes if provided, or create defaults
      let isPrimaryValues = isPrimaryImage
        ? Array.isArray(isPrimaryImage)
          ? isPrimaryImage.map((val) => val === 'true' || val === true)
          : [isPrimaryImage === 'true' || isPrimaryImage === true]
        : [];

      let altTextValues = imageAltText
        ? Array.isArray(imageAltText)
          ? imageAltText
          : [imageAltText]
        : [];

      // Ensure arrays are at least as long as the files array
      while (isPrimaryValues.length < files.length) isPrimaryValues.push(false);
      while (altTextValues.length < files.length) altTextValues.push('');

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          // Read the file from temp storage
          const imageBuffer = fs.readFileSync(file.path);

          // Make the first image primary if none are marked as primary
          const isFirstImage = i === 0;
          const isPrimary =
            isPrimaryValues[i] ||
            (isFirstImage && !isPrimaryValues.some((val) => val));

          // Create the image record outside the transaction
          await prismaWithProductImage.productImage.create({
            data: {
              productId: product.id,
              imageData: imageBuffer,
              contentType: file.mimetype,
              fileName: file.originalname,
              fileSize: file.size,
              isPrimary,
              altText: altTextValues[i] || file.originalname,
              sortOrder: i, // Set the sort order based on the upload order
            },
          });
        } catch (err) {
          console.error('Error creating product image:', err);
          // Continue processing other images even if one fails
        } finally {
          // Clean up the temp file regardless of success or failure
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
    }

    // Fetch the complete product with images to return
    const result = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        brand: true,
        taxRate: true,
        barCode: true,
        productTag: true,
        containerFee: true,
        mulitChoiceProductGroup: true,
        // @ts-ignore - Will be fixed after prisma generate
        images: {
          select: {
            id: true,
            fileName: true,
            contentType: true,
            fileSize: true,
            isPrimary: true,
            altText: true,
            sortOrder: true,
            createdAt: true,
          },
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
    });

    // Add image URLs to the response
    if (result && result.images && result.images.length > 0) {
      // @ts-ignore
      result.images = result.images.map((image) => ({
        ...image,
        imageUrl: `/api/v1/products/${result.id}/images/${image.id}`,
      }));
    }

    res.status(201).json(result);
  } catch (error: ApiError | any) {
    // Clean up temp files if they exist
    cleanupTempFiles(req.files as Express.Multer.File[]);

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
      productTagId,
      containerFeeId,
      mulitChoiceProductGroupId,
      // Image specific fields - will be processed as arrays for multiple images
      isPrimaryImage,
      imageAltText,
    } = req.body;

    const productExists = await prisma.product.findUnique({ where: { id } });
    if (!productExists) {
      // Clean up temp files if they exist
      cleanupTempFiles(req.files as Express.Multer.File[]);
      throw new ApiError({
        message: `Product with ID ${id} not found`,
        statusCode: 404,
      });
    }

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        // Clean up temp files if they exist
        cleanupTempFiles(req.files as Express.Multer.File[]);
        throw new ApiError({ message: 'Category not found', statusCode: 404 });
      }
    }

    if (brandId) {
      const brandExists = await prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!brandExists) {
        // Clean up temp files if they exist
        cleanupTempFiles(req.files as Express.Multer.File[]);
        throw new ApiError({ message: 'Brand not found', statusCode: 404 });
      }
    }

    if (taxRateId) {
      const taxRateExists = await prisma.taxRate.findUnique({
        where: { id: taxRateId },
      });
      if (!taxRateExists) {
        // Clean up temp files if they exist
        cleanupTempFiles(req.files as Express.Multer.File[]);
        throw new ApiError({ message: 'Tax rate not found', statusCode: 404 });
      }
    }

    if (unitOfSale && !Object.values(UnitOfSale).includes(unitOfSale)) {
      // Clean up temp files if they exist
      cleanupTempFiles(req.files as Express.Multer.File[]);
      throw new ApiError({ message: 'Invalid unit of sale', statusCode: 400 });
    }

    // Check if posOrder is provided and if it already exists (but not on the current product)
    if (posOrder && posOrder !== productExists.posOrder) {
      const existingProduct = await prisma.product.findFirst({
        where: { posOrder },
      });

      if (existingProduct) {
        // Clean up temp files if they exist
        cleanupTempFiles(req.files as Express.Multer.File[]);
        throw new ApiError({
          message:
            'A product with this POS order already exists. POS order must be unique.',
          statusCode: 400,
        });
      }
    }

    // Use a transaction to ensure both product and image are updated together
    const result = await prisma.$transaction(async (tx) => {
      // Update the product first
      await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          costPrice: costPrice ? parseFloat(costPrice as string) : undefined,
          salePrice: salePrice ? parseFloat(salePrice as string) : undefined,
          rating,
          sellOnPos:
            sellOnPos !== undefined
              ? sellOnPos === 'true' || sellOnPos === true
              : undefined,
          sellOnTill:
            sellOnTill !== undefined
              ? sellOnTill === 'true' || sellOnTill === true
              : undefined,
          rrp: rrp ? parseFloat(rrp as string) : undefined,
          variablePrice:
            variablePrice !== undefined
              ? variablePrice === 'true' || variablePrice === true
              : undefined,
          taxExempt:
            taxExempt !== undefined
              ? taxExempt === 'true' || taxExempt === true
              : undefined,
          warranty,
          manufacturer,
          manufactureDate: manufactureDate
            ? new Date(manufactureDate as string)
            : undefined,
          expiryDate: expiryDate ? new Date(expiryDate as string) : undefined,
          posOrder,
          buttonColor,
          scannableOnly:
            scannableOnly !== undefined
              ? scannableOnly === 'true' || scannableOnly === true
              : undefined,
          orderQuantityLimit,
          unitOfSale,
          volumeOfSale,
          categoryId,
          brandId,
          taxRateId,
          productTagId,
          containerFeeId,
          mulitChoiceProductGroupId,
        },
      });

      // If images were uploaded, process them
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        // Get the arrays of image attributes if provided, or create defaults
        let isPrimaryValues = isPrimaryImage
          ? Array.isArray(isPrimaryImage)
            ? isPrimaryImage.map((val) => val === 'true' || val === true)
            : [isPrimaryImage === 'true' || isPrimaryImage === true]
          : [];

        let altTextValues = imageAltText
          ? Array.isArray(imageAltText)
            ? imageAltText
            : [imageAltText]
          : [];

        // Ensure arrays are at least as long as the files array
        while (isPrimaryValues.length < files.length)
          isPrimaryValues.push(false);
        while (altTextValues.length < files.length) altTextValues.push('');

        // Process each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Read the file from temp storage
          const imageBuffer = fs.readFileSync(file.path);

          // Create the image record
          try {
            // Double-check that product ID is valid
            if (!id) {
              throw new Error('Invalid product ID');
            }

            await prismaWithProductImage.productImage.create({
              data: {
                productId: id,
                imageData: imageBuffer,
                contentType: file.mimetype,
                fileName: file.originalname,
                fileSize: file.size,
                isPrimary: isPrimaryValues[i],
                altText: altTextValues[i] || file.originalname,
                sortOrder: i, // Set the sort order based on the upload order
              },
            });
          } catch (err) {
            console.error('Error creating product image:', err);
            throw new ApiError({
              message:
                'Failed to create product image. Please check that the product ID is valid.',
              statusCode: 500,
            });
          }

          // Clean up the temp file
          fs.unlinkSync(file.path);
        }
      }

      // Return the updated product with full details
      return await tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          taxRate: true,
          barCode: true,
          productTag: true,
          containerFee: true,
          mulitChoiceProductGroup: true,
          // @ts-ignore - Will be fixed after prisma generate
          images: {
            select: {
              id: true,
              fileName: true,
              contentType: true,
              fileSize: true,
              isPrimary: true,
              altText: true,
              sortOrder: true,
              createdAt: true,
            },
            orderBy: [
              { isPrimary: 'desc' },
              { sortOrder: 'asc' },
              { createdAt: 'asc' },
            ],
          },
        },
      });
    });

    // Add image URLs to the response
    if (result && result.images && result.images.length > 0) {
      // @ts-ignore
      result.images = result.images.map((image) => ({
        ...image,
        imageUrl: `/api/v1/products/${result.id}/images/${image.id}`,
      }));
    }

    res.status(200).json(result);
  } catch (error: ApiError | any) {
    // Clean up temp files if they exist
    cleanupTempFiles(req.files as Express.Multer.File[]);

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
    res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to delete product',
    });
  }
};

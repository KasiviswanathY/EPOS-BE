# Create product_image table migration

## Description
This migration adds a new table for storing product images directly in PostgreSQL using the bytea data type.
Each product can have multiple images, with metadata including content type, file name, and more.
One image can be marked as the primary image for the product.

## Changes
- Create `product_image` table with binary storage
- Add relation to product table

## Command to run
```
npx prisma migrate dev --name add_product_images
```

## After migration
After the migration, run the following to update the Prisma client:
```
npx prisma generate
```
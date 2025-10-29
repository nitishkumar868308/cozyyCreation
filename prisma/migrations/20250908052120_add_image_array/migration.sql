/*
  Warnings:

  - The `image` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image` column on the `ProductVariation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];

-- AlterTable
ALTER TABLE "public"."ProductVariation" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];

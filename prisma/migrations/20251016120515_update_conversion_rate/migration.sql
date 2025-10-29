/*
  Warnings:

  - The `conversionRate` column on the `CountryPricing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."CountryPricing" DROP COLUMN "conversionRate",
ADD COLUMN     "conversionRate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "color" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "size" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "stock" INTEGER;

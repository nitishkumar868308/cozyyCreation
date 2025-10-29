-- DropForeignKey
ALTER TABLE "public"."MarketLink" DROP CONSTRAINT "MarketLink_productId_fkey";

-- AlterTable
ALTER TABLE "public"."MarketLink" ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."MarketLink" ADD CONSTRAINT "MarketLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

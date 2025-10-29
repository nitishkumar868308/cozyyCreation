-- AlterTable
ALTER TABLE "public"."Address" ADD COLUMN     "customType" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

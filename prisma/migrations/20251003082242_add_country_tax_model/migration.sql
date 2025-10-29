-- CreateTable
CREATE TABLE "public"."CountryTax" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "generalTax" DOUBLE PRECISION,
    "gstTax" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryTax_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CountryTax" ADD CONSTRAINT "CountryTax_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

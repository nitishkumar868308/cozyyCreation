-- CreateTable
CREATE TABLE "public"."CountryPricing" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountryPricing_code_key" ON "public"."CountryPricing"("code");

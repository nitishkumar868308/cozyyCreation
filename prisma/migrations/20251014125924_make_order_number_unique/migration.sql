/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Orders_orderNumber_key" ON "public"."Orders"("orderNumber");

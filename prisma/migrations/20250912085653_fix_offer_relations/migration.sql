-- CreateTable
CREATE TABLE "public"."_ProductOffers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductOffers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductOffers_B_index" ON "public"."_ProductOffers"("B");

-- AddForeignKey
ALTER TABLE "public"."_ProductOffers" ADD CONSTRAINT "_ProductOffers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProductOffers" ADD CONSTRAINT "_ProductOffers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

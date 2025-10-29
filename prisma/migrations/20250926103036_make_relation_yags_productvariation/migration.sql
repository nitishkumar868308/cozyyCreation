-- CreateTable
CREATE TABLE "public"."_VariationTags" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VariationTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_VariationTags_B_index" ON "public"."_VariationTags"("B");

-- AddForeignKey
ALTER TABLE "public"."_VariationTags" ADD CONSTRAINT "_VariationTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VariationTags" ADD CONSTRAINT "_VariationTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

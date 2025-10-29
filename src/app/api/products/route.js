import { PrismaClient } from "@prisma/client";
import { convertProducts } from "@/lib/priceConverter";

const prisma = new PrismaClient();

// Post Products
// export async function POST(req) {
//     try {
//         const body = await req.json();
//         const {
//             name,
//             offers,
//             primaryOffer,
//             category,
//             subcategory,
//             short,
//             image,
//             description,
//             active,
//             sku,
//             slug,
//             metaTitle,
//             metaDescription,
//             price,
//             otherCountriesPrice,
//             stock,
//             size,
//             color,
//             variations
//         } = body;

//         if (!name?.trim() || !subcategory || !sku?.trim()) {
//             return new Response(
//                 JSON.stringify({ message: "Name, Subcategory, and SKU are required" }),
//                 { status: 400 }
//             );
//         }

//         if (!sku?.trim()) {
//             return new Response(
//                 JSON.stringify({ message: "SKU is required" }),
//                 { status: 400 }
//             );
//         }
//         if (!slug?.trim()) {
//             return new Response(
//                 JSON.stringify({ message: "Slug is required" }),
//                 { status: 400 }
//             );
//         }

//         // Pre-check SKU
//         const existingSKU = await prisma.product.findUnique({
//             where: { sku: sku.trim() },
//         });
//         if (existingSKU) {
//             return new Response(
//                 JSON.stringify({ message: "SKU must be unique. This SKU already exists." }),
//                 { status: 400 }
//             );
//         }

//         // Pre-check Slug
//         const existingSlug = await prisma.product.findUnique({
//             where: { slug: slug.trim() },
//         });
//         if (existingSlug) {
//             return new Response(
//                 JSON.stringify({ message: "Slug must be unique. This Product Name already exists." }),
//                 { status: 400 }
//             );
//         }


//         // Create main product
//         const product = await prisma.product.create({
//             data: {
//                 name,
//                 offers,
//                 primaryOffer,
//                 category,
//                 subcategory,
//                 image: Array.isArray(image) ? image : [],
//                 description: description ?? null,
//                 active: active ?? true,
//                 sku,
//                 slug,
//                 short,
//                 metaTitle: metaTitle ?? `${name} | YourStore`,
//                 metaDescription: metaDescription ?? description ?? "",
//                 otherCountriesPrice: otherCountriesPrice?.toString() ?? null,
//                 price: price?.toString() ?? null,
//                 stock: stock?.toString() ?? null,
//                 size: size ?? null,
//                 color: color ?? null,
//                 variations: variations && Array.isArray(variations) && variations.length > 0
//                     ? {
//                         create: variations.map(v => ({
//                             variationName: v.variation_name,
//                             sku: v.sku,
//                             price: v.price?.toString() ?? price?.toString() ?? null,
//                             short: v.short?.toString() ?? short?.toString() ?? null,
//                             stock: v.stock?.toString() ?? stock?.toString() ?? null,
//                             image: Array.isArray(v.image) ? v.image : (v.image ? [v.image] : []),
//                             description: v.description ?? description ?? null,
//                             name: v.name ?? name,
//                             otherCountriesPrice: v.otherCountriesPrice?.toString() ?? otherCountriesPrice?.toString() ?? null
//                         }))
//                     }
//                     : undefined
//             },
//             include: {
//                 variations: true,
//                 category: true,
//                 subcategory: true
//             }
//         });

//         // Create variations
//         // if (variations && Array.isArray(variations) && variations.length > 0) {
//         //     const variationsData = variations.map(v => ({
//         //         productId: product.id,
//         //         variationName: v.variation_name,
//         //         price: v.price?.toString() ?? price?.toString() ?? null,
//         //         stock: v.stock?.toString() ?? stock?.toString() ?? null,
//         //         sku: v.sku,
//         //         image: v.image ?? null,
//         //         description: v.description ?? description ?? null,
//         //         name: v.name ?? name
//         //     }));

//         //     await prisma.productVariation.createMany({
//         //         data: variationsData
//         //     });
//         // }

//         return new Response(
//             JSON.stringify({ message: "Product created successfully with variations", data: product }),
//             { status: 201 }
//         );

//     } catch (error) {
//         return new Response(
//             JSON.stringify({ message: "Failed to create product", error: error.message }),
//             { status: 500 }
//         );
//     }
// }
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            name,
            offers,
            primaryOffer,
            category,
            subcategory,
            short,
            image,
            description,
            active,
            sku,
            slug,
            metaTitle,
            metaDescription,
            price,
            otherCountriesPrice,
            stock,
            size,
            color,
            variations,
            tags,
            marketLinks,
            isDefault,
            minQuantity,
            bulkPrice
        } = body;
        // console.log("isDefault", isDefault)
        if (!name?.trim() || !subcategory || !sku?.trim()) {
            return new Response(
                JSON.stringify({ message: "Name, Subcategory, and SKU are required" }),
                { status: 400 }
            );
        }

        if (!sku?.trim()) {
            return new Response(
                JSON.stringify({ message: "SKU is required" }),
                { status: 400 }
            );
        }
        if (!slug?.trim()) {
            return new Response(
                JSON.stringify({ message: "Slug is required" }),
                { status: 400 }
            );
        }

        if (variations && Array.isArray(variations)) {
            const duplicateSKU = variations.find(v => v.sku?.trim() === sku?.trim());
            if (duplicateSKU) {
                return new Response(
                    JSON.stringify({
                        message: `Variation SKU "${duplicateSKU.sku}" cannot be the same as the main product SKU`
                    }),
                    { status: 400 }
                );
            }

            // Optional: check duplicate SKUs *within variations themselves*
            const variationSKUs = variations.map(v => v.sku?.trim());
            const duplicates = variationSKUs.filter((s, i) => variationSKUs.indexOf(s) !== i);
            if (duplicates.length > 0) {
                return new Response(
                    JSON.stringify({
                        message: `Duplicate SKUs found in variations: ${[...new Set(duplicates)].join(", ")}`
                    }),
                    { status: 400 }
                );
            }
        }

        // Pre-check SKU
        const existingSKU = await prisma.product.findUnique({
            where: { sku: sku.trim() },
        });
        if (existingSKU) {
            return new Response(
                JSON.stringify({ message: "SKU must be unique. This SKU already exists." }),
                { status: 400 }
            );
        }

        // Pre-check Slug
        const existingSlug = await prisma.product.findUnique({
            where: { slug: slug.trim() },
        });
        if (existingSlug) {
            return new Response(
                JSON.stringify({ message: "Slug must be unique. This Product Name already exists." }),
                { status: 400 }
            );
        }

        // Create main product
        const product = await prisma.product.create({
            data: {
                name,
                offers,
                primaryOffer,
                category,
                subcategory,
                image: Array.isArray(image) ? image : [],
                description: description ?? null,
                active: active ?? true,
                sku: sku.trim(),
                slug: slug.trim(),
                short,
                metaTitle: metaTitle ?? `${name} | YourStore`,
                metaDescription: metaDescription ?? description ?? "",
                otherCountriesPrice: otherCountriesPrice?.toString() ?? null,
                price: price?.toString() ?? null,
                stock: stock?.toString() ?? null,
                size: size ?? null,
                color: color ?? null,
                tags,
                isDefault,
                minQuantity: minQuantity?.toString() ?? null,
                bulkPrice: bulkPrice?.toString() ?? null,
                marketLinks: marketLinks?.connect?.length > 0
                    ? { connect: marketLinks.connect.map(link => ({ id: link.id })) }
                    : undefined,
                variations: variations && Array.isArray(variations) && variations.length > 0
                    ? {
                        create: variations.map(v => ({
                            variationName: v.variation_name,
                            sku: v.sku,
                            price: v.price?.toString() ?? price?.toString() ?? null,
                            short: v.short?.toString() ?? short?.toString() ?? null,
                            stock: v.stock?.toString() ?? stock?.toString() ?? null,
                            image: Array.isArray(v.image) ? v.image : (v.image ? [v.image] : []),
                            description: v.description ?? description ?? null,
                            name: v.name ?? name,
                            tags: v.tags && v.tags.length > 0
                                ? {
                                    connect: v.tags.map(tag => ({ id: Number(tag.id) }))
                                }
                                : undefined,
                            otherCountriesPrice: v.otherCountriesPrice?.toString() ?? otherCountriesPrice?.toString() ?? null,
                            minQuantity: minQuantity?.toString() ?? null,
                            bulkPrice: bulkPrice?.toString() ?? null,
                        }))
                    }
                    : undefined
            },
            include: {
                variations: {
                    include: {
                        tags: true,
                    }
                },
                category: true,
                subcategory: true,
                tags: true,
                marketLinks: true,
                offers: true,
                primaryOffer: true
            }
        });

        // console.log("product", product)

        return new Response(
            JSON.stringify({ message: "Product created successfully with variations", data: product }),
            { status: 201 }
        );

    } catch (error) {
        // ✅ Handle Prisma unique constraint errors
        if (error.code === "P2002" && error.meta?.target?.length > 0) {
            return new Response(
                JSON.stringify({
                    message: `Duplicate field: ${error.meta.target.join(", ")} already exists`
                }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Failed to create product", error: error.message }),
            { status: 500 }
        );
    }
}



export async function GET(req) {
    try {
        const countryCode = req.headers.get("x-country") || "IN";

        const countryPricingList = await prisma.countryPricing.findMany({
            where: { deleted: 0, active: true },
        });

        const products = await prisma.product.findMany({
            where: {
                deleted: 0,
                active: true,
                NOT: {
                    image: { equals: [] }  // image array empty na ho
                }
            },
            include: {
                variations: {
                    include: {
                        tags: true,
                    }
                },
                category: true,
                subcategory: true,
                offers: true,
                primaryOffer: true,
                tags: true,
                marketLinks: true,
            },
        });
        // const products = await prisma.product.findMany({
        //     where: {
        //         deleted: 0,
        //     },
        //     select: {
        //         id: true,
        //         name: true,
        //         price: true,
        //         active: true,
        //         image: true,

        //         category: {
        //             select: { id: true, name: true },
        //         },
        //         subcategory: {
        //             select: { id: true, name: true },
        //         },
        //         tags: {
        //             select: { id: true, name: true },
        //         },
        //         offers: {
        //             select: { id: true, name: true },
        //         },
        //         primaryOffer: {
        //             select: { id: true, name: true },
        //         },
        //         marketLinks: {
        //             select: { id: true, name: true },
        //         },

        //         variations: {
        //             select: {
        //                 variationName: true,
        //                 id: true,
        //                 name: true,
        //                 image,
        //                 tags: {
        //                     select: { id: true, name: true },
        //                 },
        //             },
        //         },
        //     },
        //     take: 1000,
        // });

        const updatedProducts = await convertProducts(products, countryCode, countryPricingList);

        return new Response(JSON.stringify(updatedProducts), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch products", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE soft delete product
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Product ID is required" }), { status: 400 });
        }

        // check if product exists
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        // Start a transaction to update both product and variations together
        const [deletedProduct] = await prisma.$transaction([
            prisma.product.update({
                where: { id },
                data: { deleted: 1 }, // soft delete product
            }),
            prisma.productVariation.updateMany({
                where: { productId: id },
                data: { deleted: 1 }, // soft delete variations
            }),
        ]);

        return new Response(
            JSON.stringify({ message: "Product and its variations deleted successfully", data: deletedProduct }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete product", error: error.message }),
            { status: 500 }
        );
    }
}

// PUT update product
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, data } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Product ID is required" }), { status: 400 });
        }

        const existing = await prisma.product.findUnique({
            where: { id },
            include: { variations: true },
        });

        if (!existing) {
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        const {
            name,
            description,
            short,
            active,
            deleted,
            sku,
            slug,
            metaTitle,
            metaDescription,
            keywords,
            price,
            stock,
            size = [],
            color = [],
            otherCountriesPrice,
            image = [],
            offers = [],
            primaryOffer = null,
            categoryId = null,
            subcategoryId = null,
            variations = [],
            tags = [],
            marketLinks,
            isDefault,
            minQuantity,
            bulkPrice
        } = data;

        // console.log("===== Backend received product data =====");
        // console.log({
        //     name,
        //     sku,
        //     price,
        //     stock,
        //     tags,
        //     offers,
        //     primaryOffer,
        //     categoryId,
        //     subcategoryId,
        //     isDefault
        // });
        console.log("Offers being updated:", offers);
        console.log("Primary Offer being updated:", primaryOffer);

        // console.log("===== Backend received variations =====");
        variations.forEach((v, i) => {
            console.log(`Variation #${i + 1}:`, v);
        });


        // Update existing variations safely
        const variationsUpdate = variations
            .filter(v => v.id)
            .map(v => {
                const existingVar = existing.variations.find(ev => ev.id === v.id);
                return {
                    where: { id: v.id },
                    data: {
                        variationName: v.variationName ?? existingVar.variationName,
                        short: v.short ?? existingVar.short,
                        name: v.name ?? existingVar.name,
                        price: v.price != null ? v.price.toString() : existingVar.price,
                        stock: v.stock != null ? v.stock.toString() : existingVar.stock,
                        sku: existingVar.sku,
                        image: Array.isArray(v.image) ? v.image.flat() : v.image ? [v.image] : existingVar.image,
                        description: v.description ?? existingVar.description,
                        tags: v.tags?.length
                            ? { set: v.tags.map(tag => ({ id: Number(tag.id) })) }
                            : undefined,
                        minQuantity: v.minQuantity != null ? v.minQuantity.toString() : null,
                        bulkPrice: v.bulkPrice != null ? v.bulkPrice.toString() : null,
                    }
                };
            });

        // console.log("variationsUpdate JSON:", JSON.stringify(variationsUpdate, null, 2));

        // console.log("variationsUpdate", variationsUpdate)


        // Create new variations with unique SKU (frontend responsibility)
        const variationsCreate = variations
            .filter(v => !v.id)
            .map(v => ({
                variationName: v.variationName,
                price: v.price != null ? v.price.toString() : null,
                stock: v.stock != null ? v.stock.toString() : null,
                sku: v.sku,
                image: Array.isArray(v.image) ? v.image.flat() : v.image ? [v.image] : [],
                description: v.description,
                short: v.short,
                name: v.name,
                tags: v.tags?.length
                    ? { connect: v.tags.map(tag => ({ id: Number(tag.id) })) }
                    : undefined,
                minQuantity: v.minQuantity != null ? v.minQuantity.toString() : null,
                bulkPrice: v.bulkPrice != null ? v.bulkPrice.toString() : null,
            }));

        // PUT handler ke andar, variationsUpdate aur variationsCreate ke baad:

        // IDs jo frontend se aaye
        const incomingVariationIds = variations.filter(v => v.id).map(v => v.id);

        // Jo existing DB mein the
        const existingVariationIds = existing.variations.map(v => v.id);

        // Delete hone wale = jo DB mein hain but frontend se missing hain
        const variationsToDelete = existingVariationIds.filter(id => !incomingVariationIds.includes(id));

        // console.log("variationsToDelete", variationsToDelete);

        // console.log("variationsCreate JSON:", JSON.stringify(variationsCreate, null, 2));

        // console.log("variationsCreate", variationsCreate)
        const variationSkus = variations.map(v => v.sku);
        if (new Set(variationSkus).size !== variationSkus.length) {
            return new Response(JSON.stringify({ message: "Duplicate SKU in variations" }), { status: 400 });
        }

        // Ensure no variation SKU matches main product SKU
        if (variationSkus.includes(existing.sku)) {
            return new Response(JSON.stringify({ message: "Variation SKU cannot match main product SKU" }), { status: 400 });
        }


        // Check if variation SKUs already exist in DB (excluding current product)
        const existingSkusInDB = await prisma.product.findMany({
            where: {
                sku: { in: variations.map(v => v.sku).filter(Boolean) },
                NOT: { id }, // exclude current product
            },
            select: { sku: true }
        });



        if (existingSkusInDB.length > 0) {
            return new Response(JSON.stringify({ message: `SKUs already exist: ${existingSkusInDB.map(e => e.sku).join(", ")}` }), { status: 400 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                short: short ?? existing.short,
                description: description ?? existing.description,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
                sku: sku ?? existing.sku, // main product SKU remains same
                slug: slug ?? (name ? generateSlug(name) : existing.slug),
                metaTitle: metaTitle ?? (name ?? existing.name),
                metaDescription: metaDescription ?? (description ?? existing.description ?? ""),
                keywords: keywords ?? existing.keywords,
                stock: stock != null ? stock.toString() : existing.stock,
                price: price != null ? price.toString() : existing.price,
                size,
                color,
                isDefault,
                minQuantity: minQuantity?.toString() ?? null,
                bulkPrice: bulkPrice?.toString() ?? null,
                otherCountriesPrice: otherCountriesPrice != null ? otherCountriesPrice.toString() : existing.otherCountriesPrice,
                image: image.length ? image : existing.image,
                category: categoryId ? { connect: { id: categoryId } } : undefined,
                subcategory: subcategoryId ? { connect: { id: subcategoryId } } : undefined,
                // offers: Array.isArray(offers) && offers.length
                //     ? { set: [], connect: offers.map(o => ({ id: Number(o.id) })) }
                //     : undefined,
                //             primaryOffer: primaryOffer && primaryOffer.id != null
                // ? { connect: { id: Number(primaryOffer.id) } }
                // : undefined,
                offers:
                    Array.isArray(offers)
                        ? { set: offers.map(o => ({ id: Number(o.id) })) }
                        : offers && (offers.set?.length || offers.connect?.length)
                            ? {
                                set: offers.set?.map(o => ({ id: Number(o.id) })) ?? [],
                                connect: offers.connect?.map(o => ({ id: Number(o.id) })) ?? [],
                            }
                            : undefined,

                primaryOffer:
                    primaryOffer?.id
                        ? { connect: { id: Number(primaryOffer.id) } }
                        : { disconnect: true },

                tags: tags?.length ? { set: [], connect: tags.map(tag => ({ id: Number(tag.id) })) } : undefined,
                marketLinks: marketLinks?.connect
                    ? { set: marketLinks.connect.map(link => ({ id: link.id })) }
                    : { set: [] }, // clear if empty
                variations: {
                    update: variationsUpdate,
                    create: variationsCreate,
                    delete: variationsToDelete.map(id => ({ id })),
                },
            },
            include: {
                variations: {
                    include: {
                        tags: true,
                    }
                },
                offers: true,
                primaryOffer: true,
                category: true,
                subcategory: true,
                tags: true,
                marketLinks: true
            },
        });

        console.log("updatedProduct", updatedProduct)

        return new Response(
            JSON.stringify({
                message: "Product and variations updated successfully",
                data: updatedProduct,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update product",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, active = true } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: "ID is required" }),
                { status: 400 }
            );
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: { active },
        });

        const statusText = active ? "Activated" : "Deactivated";

        return new Response(
            JSON.stringify({
                message: `Product ${statusText} successfully`,
                data: updatedProduct,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("PATCH Error:", error);
        return new Response(
            JSON.stringify({ error: "Something went wrong" }),
            { status: 500 }
        );
    }
}




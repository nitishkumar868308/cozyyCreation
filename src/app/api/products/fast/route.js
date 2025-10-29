// import { PrismaClient } from "@prisma/client";
// import { convertProductsFast } from "@/lib/priceConverter";
// const prisma = new PrismaClient();

// let countryPricingCache = {};

// export async function GET(req) {
//     try {
//         const countryCode = req.headers.get("x-country") || "IN";
//         const url = new URL(req.url);
//         const page = Number(url.searchParams.get("page") || 1);
//         const limit = Number(url.searchParams.get("limit") || 50);
//         const skip = (page - 1) * limit;

//         // Cache country pricing
//         if (!countryPricingCache[countryCode]) {
//             const countryPricingList = await prisma.countryPricing.findMany({
//                 where: { deleted: 0, active: true },
//             });
//             countryPricingCache[countryCode] = countryPricingList;
//         }

//         // Fetch basic product info only
//         const products = await prisma.product.findMany({
//             where: { deleted: 0 },
//             skip,
//             take: limit,
//             select: {
//                 id: true,
//                 name: true,
//                 sku: true,
//                 price: true,
//                 image:true,
//                 category: { select: { id: true, name: true } },
//                 subcategory: { select: { id: true, name: true } },
//                 primaryOffer: true,
//             },
//         });

//         const updatedProducts = await convertProductsFast(
//             products,
//             countryCode,
//             countryPricingCache[countryCode]
//         );

//         return new Response(JSON.stringify(updatedProducts), { status: 200 });
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         return new Response(
//             JSON.stringify({ message: "Failed to fetch products", error: error.message }),
//             { status: 500 }
//         );
//     }
// }

import { PrismaClient } from "@prisma/client";
import { convertProductsFast } from "@/lib/priceConverter";

const prisma = new PrismaClient();
let countryPricingCache = {};
let productCache = {}; // cache per page + country

export async function GET(req) {
    try {
        const countryCode = (req.headers.get("x-country") || "IN").toUpperCase();
        const url = new URL(req.url);
        const page = Number(url.searchParams.get("page") || 1);
        const limit = Number(url.searchParams.get("limit") || 50);
        const skip = (page - 1) * limit;

        const cacheKey = `${countryCode}-page${page}-limit${limit}`;
        if (productCache[cacheKey]) {
            return new Response(JSON.stringify(productCache[cacheKey]), { status: 200 });
        }

        // Cache country pricing
        if (!countryPricingCache[countryCode]) {
            const countryPricingList = await prisma.countryPricing.findMany({
                where: { deleted: 0, active: true },
            });
            countryPricingCache[countryCode] = countryPricingList;
        }

        // Fetch only necessary fields
        const products = await prisma.product.findMany({
            where: {
                deleted: 0,
                active: true,
                NOT: {
                    image: { equals: [] }  // image array empty na ho
                }
            },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                active: true,
                createdAt: true,
            },
        });

        console.log("products", products)
        const updatedProducts = await convertProductsFast(
            products,
            countryCode,
            countryPricingCache[countryCode]
        );

        productCache[cacheKey] = updatedProducts;
        return new Response(JSON.stringify(updatedProducts), { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return new Response(
            JSON.stringify({ message: "Failed to fetch products", error: error.message }),
            { status: 500 }
        );
    }
}


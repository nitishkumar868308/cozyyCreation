import { PrismaClient } from "@prisma/client";
import { convertProducts } from "@/lib/priceConverter";

const prisma = new PrismaClient();


export async function GET(req) {
    try {
        const products = await prisma.product.findMany({
            where: { deleted: 0 },
            include: {
                variations: { include: { tags: true } },
                category: true,
                subcategory: true,
                offers: true,
                primaryOffer: true,
                tags: true,
                marketLinks: true,
            },
        });

        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch all products", error: error.message }),
            { status: 500 }
        );
    }
}

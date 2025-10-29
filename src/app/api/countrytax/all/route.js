import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    try {
        const taxes = await prisma.countryTax.findMany({
            where: { deleted: 0 },
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({
                message: "All country taxes fetched successfully",
                data: taxes,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch all country taxes",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

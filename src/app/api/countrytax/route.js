import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET - fetch all taxes
// export async function GET(req) {
//     try {
//         const taxes = await prisma.countryTax.findMany({
//             where: { deleted: 0 },
//             include: { category: true },
//             orderBy: { createdAt: "desc" },
//         });

//         return new Response(
//             JSON.stringify({ message: "Country taxes fetched successfully", data: taxes }),
//             { status: 200 }
//         );
//     } catch (error) {
//         return new Response(
//             JSON.stringify({ message: "Failed to fetch country taxes", error: error.message }),
//             { status: 500 }
//         );
//     }
// }
// GET
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const countryCode = searchParams.get("country");
    const taxes = await prisma.countryTax.findMany({
        where: { deleted: 0, countryCode },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify({ message: "Country taxes fetched successfully", data: taxes }), { status: 200 });
}


// POST - create new tax
export async function POST(req) {
    try {
        const body = await req.json();
        console.log("body", body);
        const { country, countryCode, categoryId, type, generalTax, gstTax, active } = body;

        if (!country || !categoryId || !type) {
            return new Response(
                JSON.stringify({ message: "Country, Category, and Type are required" }),
                { status: 400 }
            );
        }

        const tax = await prisma.countryTax.create({
            data: {
                country,
                categoryId,
                countryCode,
                type,
                generalTax: generalTax != null ? parseFloat(generalTax) : null,
                gstTax: gstTax != null ? parseFloat(gstTax) : null,
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({ message: "Country tax created successfully", data: tax }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create country tax", error: error.message }),
            { status: 500 }
        );
    }
}



// PUT - update tax
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, country, categoryId, generalTax, gstTax, active, deleted } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "CountryTax ID is required" }), { status: 400 });
        }

        const existing = await prisma.countryTax.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "CountryTax not found" }), { status: 404 });
        }

        const updatedTax = await prisma.countryTax.update({
            where: { id },
            data: {
                country: country ?? existing.country,
                categoryId: categoryId ?? existing.categoryId,
                generalTax: generalTax !== undefined ? parseFloat(generalTax) : existing.generalTax,
                gstTax: gstTax !== undefined ? parseFloat(gstTax) : existing.gstTax,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({ message: "Country tax updated successfully", data: updatedTax }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update country tax", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE - soft delete tax
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "CountryTax ID is required" }), { status: 400 });
        }

        const existing = await prisma.countryTax.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "CountryTax not found" }), { status: 404 });
        }

        const deletedTax = await prisma.countryTax.update({
            where: { id },
            data: { deleted: 1 },
        });

        return new Response(
            JSON.stringify({ message: "Country tax deleted successfully", data: deletedTax }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete country tax", error: error.message }),
            { status: 500 }
        );
    }
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all country pricings
export async function GET(req) {
    try {
        const data = await prisma.countryPricing.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Country pricing fetched successfully", data }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch country pricing", error: error.message }),
            { status: 500 }
        );
    }
}

// POST new country pricing
export async function POST(req) {
    try {
        const body = await req.json();
        const { country, code, multiplier, currency, active, currencySymbol, conversionRate } = body;

        if (!country || !code || !multiplier || !currency || !currencySymbol) {
            return new Response(
                JSON.stringify({ message: "All fields (country, code, multiplier, currency) are required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.countryPricing.findUnique({
            where: { code: body.code },
        });

        if (existing) {
            return new Response(
                JSON.stringify({ message: `Country code ${body.code} already exists!` }),
                { status: 400 }
            );
        }

        const newEntry = await prisma.countryPricing.create({
            data: {
                country,
                code,
                multiplier: parseFloat(multiplier),
                currency,
                currencySymbol,
                conversionRate,
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({ message: "Country pricing created successfully", data: newEntry }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create country pricing", error: error.message }),
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, country, code, multiplier, currency, active, deleted, conversionRate } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
        }

        const existing = await prisma.countryPricing.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Country pricing not found" }), { status: 404 });
        }

        // Check if another record already has the same code
        if (code && code !== existing.code) {
            const duplicate = await prisma.countryPricing.findUnique({ where: { code } });
            if (duplicate) {
                return new Response(
                    JSON.stringify({ message: `Country code ${code} already exists.` }),
                    { status: 400 }
                );
            }
        }

        const updated = await prisma.countryPricing.update({
            where: { id },
            data: {
                country: country ?? existing.country,
                code: code ?? existing.code,
                multiplier: multiplier ?? existing.multiplier,
                currency: currency ?? existing.currency,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
                conversionRate : conversionRate ?? existing.conversionRate
            },
        });

        return new Response(
            JSON.stringify({ message: "Country pricing updated successfully", data: updated }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update country pricing", error: error.message }),
            { status: 500 }
        );
    }
}


// DELETE (soft delete)
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
        }

        const existing = await prisma.countryPricing.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Country pricing not found" }), { status: 404 });
        }

        const deletedEntry = await prisma.countryPricing.update({
            where: { id },
            data: { deleted: 1 },
        });

        return new Response(
            JSON.stringify({ message: "Country pricing deleted successfully", data: deletedEntry }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete country pricing", error: error.message }),
            { status: 500 }
        );
    }
}

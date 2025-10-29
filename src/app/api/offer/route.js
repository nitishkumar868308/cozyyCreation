import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - All offers
export async function GET() {
    try {
        const offers = await prisma.offer.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Offers fetched successfully", data: offers }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch offers", error: error.message }),
            { status: 500 }
        );
    }
}

// POST - Create offer
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, discountType, discountValue, type, description, active } = body;

        if (!name || typeof name !== "string") {
            return new Response(
                JSON.stringify({ message: "Name is required and must be a string" }),
                { status: 400 }
            );
        }

        if (!discountType || !["percentage", "buyXGetY", "rangeBuyXGetY"].includes(discountType)) {
            return new Response(
                JSON.stringify({ message: "Invalid discountType" }),
                { status: 400 }
            );
        }

        if (!discountValue || typeof discountValue !== "object") {
            return new Response(
                JSON.stringify({ message: "discountValue must be an object" }),
                { status: 400 }
            );
        }

        const offer = await prisma.offer.create({
            data: {
                name,
                discountType,
                discountValue,
                type: type ?? [],
                description: description ?? "",
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({ message: "Offer created successfully", data: offer }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create offer", error: error.message }),
            { status: 500 }
        );
    }
}

// PUT - Update offer
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, discountType, discountValue, type, description, active, deleted } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Offer ID is required" }), { status: 400 });
        }

        const existing = await prisma.offer.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Offer not found" }), { status: 404 });
        }

        const updatedOffer = await prisma.offer.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                discountType: discountType ?? existing.discountType,
                discountValue: discountValue ?? existing.discountValue,
                type: type ?? existing.type,
                description: description ?? existing.description,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({ message: "Offer updated successfully", data: updatedOffer }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update offer", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE - Soft delete offer
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Offer ID is required" }), { status: 400 });
        }

        const existing = await prisma.offer.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Offer not found" }), { status: 404 });
        }

        const deletedOffer = await prisma.offer.update({
            where: { id },
            data: { deleted: 1 },
        });

        return new Response(
            JSON.stringify({ message: "Offer deleted successfully", data: deletedOffer }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete offer", error: error.message }),
            { status: 500 }
        );
    }
}

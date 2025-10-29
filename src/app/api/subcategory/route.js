import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all subcategories
export async function GET(req) {
    try {
        const subcategories = await prisma.subcategory.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
            include: { category: true }
        });
        // console.log("subcategories" , subcategories)

        return new Response(
            JSON.stringify({ message: "Subcategories fetched successfully", data: subcategories }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch subcategories", error: error.message }),
            { status: 500 }
        );
    }
}

// POST create subcategory
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, categoryId, active, image, offerId } = body;
        // console.log("image" , image)

        // Validation
        if (!name || typeof name !== "string") {
            return new Response(
                JSON.stringify({ message: "Name is required and must be a string" }),
                { status: 400 }
            );
        }
        if (!categoryId) {
            return new Response(
                JSON.stringify({ message: "categoryId is required" }),
                { status: 400 }
            );
        }
        if (active !== undefined && typeof active !== "boolean") {
            return new Response(
                JSON.stringify({ message: "Active must be true or false" }),
                { status: 400 }
            );
        }

        const subcategory = await prisma.subcategory.create({
            data: {
                name,
                categoryId,
                active: active ?? true,
                image: image ?? null,
                offerId: offerId ?? null,
            },
        });

        return new Response(
            JSON.stringify({ message: "Subcategory created successfully", data: subcategory }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create subcategory", error: error.message }),
            { status: 500 }
        );
    }
}

// PUT update subcategory
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, categoryId, active, deleted, image, offerId } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Subcategory ID is required" }), { status: 400 });
        }

        const existing = await prisma.subcategory.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Subcategory not found" }), { status: 404 });
        }

        const updatedSubcategory = await prisma.subcategory.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                categoryId: categoryId ?? existing.categoryId,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
                image: image ?? existing.image,
                offerId: offerId ?? null,
            },
        });

        return new Response(
            JSON.stringify({ message: "Subcategory updated successfully", data: updatedSubcategory }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update subcategory", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE soft delete subcategory
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Subcategory ID is required" }), { status: 400 });
        }

        const existing = await prisma.subcategory.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Subcategory not found" }), { status: 404 });
        }

        const deletedSubcategory = await prisma.subcategory.update({
            where: { id },
            data: { deleted: 1 }, // soft delete
        });

        return new Response(
            JSON.stringify({ message: "Subcategory deleted successfully", data: deletedSubcategory }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete subcategory", error: error.message }),
            { status: 500 }
        );
    }
}

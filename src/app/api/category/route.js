import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const categories = await prisma.category.findMany({
            where: { deleted: 0 }, 
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Categories fetched successfully", data: categories }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch categories", error: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, active, image } = body;

        // Validation
        if (!name || typeof name !== "string") {
            return new Response(
                JSON.stringify({ message: "Name is required and must be a string" }),
                { status: 400 }
            );
        }
        if (active !== undefined && typeof active !== "boolean") {
            return new Response(
                JSON.stringify({ message: "Active must be true or false" }),
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: { name, active: active ?? true, image: image ?? null, },
        });

        return new Response(
            JSON.stringify({ message: "Category created successfully", data: category }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create category", error: error.message }),
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, active, deleted, image } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Category ID is required" }), { status: 400 });
        }

        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
                image: image ?? existing.image,
            },
        });

        return new Response(
            JSON.stringify({ message: "Category updated successfully", data: updatedCategory }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update category", error: error.message }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Category ID is required" }), { status: 400 });
        }

        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

        const deletedCategory = await prisma.category.update({
            where: { id },
            data: { deleted: 1 }, // soft delete
        });

        return new Response(
            JSON.stringify({ message: "Category deleted successfully", data: deletedCategory }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete category", error: error.message }),
            { status: 500 }
        );
    }
}

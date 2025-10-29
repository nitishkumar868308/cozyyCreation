import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const attributes = await prisma.attribute.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Attributes fetched successfully", data: attributes }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch attributes", error: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, values, active } = body;

        if (!name || typeof name !== "string") {
            return new Response(
                JSON.stringify({ message: "Name is required and must be a string" }),
                { status: 400 }
            );
        }

        if (!Array.isArray(values)) {
            return new Response(
                JSON.stringify({ message: "Values must be an array of strings" }),
                { status: 400 }
            );
        }

        const attribute = await prisma.attribute.create({
            data: {
                name,
                values,
                active: active ?? true,
            },
        });

        return new Response(
            JSON.stringify({ message: "Attribute created successfully", data: attribute }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to create attribute", error: error.message }),
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, values, active, deleted } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Attribute ID is required" }), { status: 400 });
        }

        const existing = await prisma.attribute.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Attribute not found" }), { status: 404 });
        }

        const updatedAttribute = await prisma.attribute.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                values: values ?? existing.values,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(
            JSON.stringify({ message: "Attribute updated successfully", data: updatedAttribute }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update attribute", error: error.message }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Attribute ID is required" }), { status: 400 });
        }

        const existing = await prisma.attribute.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Attribute not found" }), { status: 404 });
        }

        const deletedAttribute = await prisma.attribute.update({
            where: { id },
            data: { deleted: 1 }, // soft delete
        });

        return new Response(
            JSON.stringify({ message: "Attribute deleted successfully", data: deletedAttribute }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete attribute", error: error.message }),
            { status: 500 }
        );
    }
}

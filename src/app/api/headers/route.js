import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const headers = await prisma.header.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Headers fetched successfully", data: headers }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to fetch headers", error: error.message }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, active } = body;

        // Validation
        if (!name || typeof name !== "string") {
            return new Response(JSON.stringify({ message: "Name is required and must be a string" }), { status: 400 });
        }
        if (active !== undefined && typeof active !== "boolean") {
            return new Response(JSON.stringify({ message: "Active must be true or false" }), { status: 400 });
        }

        const header = await prisma.header.create({
            data: { name, active: active ?? true },
        });

        return new Response(JSON.stringify({ message: "Header created successfully", data: header }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to create header", error: error.message }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, active, deleted } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Header ID is required" }), { status: 400 });
        }

        const existing = await prisma.header.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Header not found" }), { status: 404 });
        }

        const updatedHeader = await prisma.header.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                active: active ?? existing.active,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(JSON.stringify({ message: "Header updated successfully", data: updatedHeader }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to update header", error: error.message }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Header ID is required" }), { status: 400 });
        }

        const existing = await prisma.header.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Header not found" }), { status: 404 });
        }

        const deletedHeader = await prisma.header.update({
            where: { id },
            data: { deleted: 1 }, // soft delete
        });

        return new Response(JSON.stringify({ message: "Header deleted successfully", data: deletedHeader }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to delete header", error: error.message }), { status: 500 });
    }
}

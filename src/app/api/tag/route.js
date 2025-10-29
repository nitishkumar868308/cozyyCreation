import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET all tags
export async function GET(req) {
    try {
        const tags = await prisma.tag.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
        });

        return new Response(JSON.stringify({ message: "Tags fetched", data: tags }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Failed to fetch tags", error: err.message }), { status: 500 });
    }
}

// POST create tag
export async function POST(req) {
    try {
        const { name, active, image } = await req.json();

        if (!name) return new Response(JSON.stringify({ message: "Name is required" }), { status: 400 });

        const tag = await prisma.tag.create({
            data: { name, active: active ?? true, image: image ?? null },
        });

        return new Response(JSON.stringify({ message: "Tag created", data: tag }), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Failed to create tag", error: err.message }), { status: 500 });
    }
}

// PUT update tag
export async function PUT(req) {
    try {
        const { id, name, active, image, deleted } = await req.json();
        if (!id) return new Response(JSON.stringify({ message: "Tag ID required" }), { status: 400 });

        const existing = await prisma.tag.findUnique({ where: { id } });
        if (!existing) return new Response(JSON.stringify({ message: "Tag not found" }), { status: 404 });

        const updatedTag = await prisma.tag.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                active: active ?? existing.active,
                image: image ?? existing.image,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(JSON.stringify({ message: "Tag updated", data: updatedTag }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Failed to update tag", error: err.message }), { status: 500 });
    }
}

// DELETE (soft delete)
export async function DELETE(req) {
    try {
        const { id } = await req.json();
        if (!id) return new Response(JSON.stringify({ message: "Tag ID required" }), { status: 400 });

        const existing = await prisma.tag.findUnique({ where: { id } });
        if (!existing) return new Response(JSON.stringify({ message: "Tag not found" }), { status: 404 });

        const deletedTag = await prisma.tag.update({
            where: { id },
            data: { deleted: true },
        });

        return new Response(JSON.stringify({ message: "Tag deleted", data: deletedTag }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Failed to delete tag", error: err.message }), { status: 500 });
    }
}

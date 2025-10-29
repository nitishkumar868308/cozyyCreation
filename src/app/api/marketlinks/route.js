import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET all links
export async function GET(req) {
    try {
        const links = await prisma.marketLink.findMany({
            where: { deleted: false },
            include: { product: true }, // include product data
            orderBy: { createdAt: "desc" },
        });

        return new Response(JSON.stringify({ message: "Links fetched", data: links }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Failed to fetch links", error: err.message }), { status: 500 });
    }
}

// POST create link
export async function POST(req) {
    try {
        const { countryName, countryCode, productName, url } = await req.json();

        if (!countryName || !countryCode || !productName || !url)
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });

        const name = productName

        const link = await prisma.marketLink.create({
            data: { countryName, countryCode, name, url },
        });

        return new Response(JSON.stringify({ message: "Link created", data: link }), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Failed to create link", error: err.message }), { status: 500 });
    }
}

// PUT update link
export async function PUT(req) {
    try {
        const { id, countryName, countryCode, productName, url, deleted } = await req.json();
        if (!id) return new Response(JSON.stringify({ message: "Link ID required" }), { status: 400 });

        const existing = await prisma.marketLink.findUnique({ where: { id } });
        if (!existing) return new Response(JSON.stringify({ message: "Link not found" }), { status: 404 });

        const updatedLink = await prisma.marketLink.update({
            where: { id },
            data: {
                countryName: countryName ?? existing.countryName,
                countryCode: countryCode ?? existing.countryCode,
                name: productName ?? existing.name,
                url: url ?? existing.url,
                deleted: deleted ?? existing.deleted,
            },
        });

        return new Response(JSON.stringify({ message: "Link updated", data: updatedLink }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Failed to update link", error: err.message }), { status: 500 });
    }
}

// DELETE (soft delete)
export async function DELETE(req) {
    try {
        const { id } = await req.json();
        if (!id) return new Response(JSON.stringify({ message: "Link ID required" }), { status: 400 });

        const existing = await prisma.marketLink.findUnique({ where: { id } });
        if (!existing) return new Response(JSON.stringify({ message: "Link not found" }), { status: 404 });

        const deletedLink = await prisma.marketLink.update({
            where: { id },
            data: { deleted: true },
        });

        return new Response(JSON.stringify({ message: "Link deleted", data: deletedLink }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Failed to delete link", error: err.message }), { status: 500 });
    }
}

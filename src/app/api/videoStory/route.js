import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all videos
export async function GET(req) {
    try {
        const videos = await prisma.videoStory.findMany({
            where: { deleted: 0 },
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Videos fetched successfully", data: videos }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch videos", error: error.message }),
            { status: 500 }
        );
    }
}

// POST upload new video
export async function POST(req) {
    try {
        const body = await req.json();
        const { title, url, active } = body;
        // console.log("title" , title)
        // console.log("url" , url)
        // console.log("active" , active)

        if (!title || typeof title !== "string") {
            return new Response(
                JSON.stringify({ message: "Title is required and must be a string" }),
                { status: 400 }
            );
        }

        if (!url || typeof url !== "string") {
            return new Response(
                JSON.stringify({ message: "Video URL is required" }),
                { status: 400 }
            );
        }

        const video = await prisma.videoStory.create({
            data: {
                title,
                url,
                active: active ?? true,
                deleted: 0,
            },
        });

        return new Response(
            JSON.stringify({ message: "Video uploaded successfully", data: video }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to upload video", error: error.message }),
            { status: 500 }
        );
    }
}

// PUT update video (title / url / active)
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, title, url, active } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Video ID is required" }), { status: 400 });
        }

        const existing = await prisma.videoStory.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Video not found" }), { status: 404 });
        }

        const updatedVideo = await prisma.videoStory.update({
            where: { id },
            data: {
                title: title ?? existing.title,
                url: url ?? existing.url,
                active: active ?? existing.active,
            },
        });

        return new Response(
            JSON.stringify({ message: "Video updated successfully", data: updatedVideo }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to update video", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE (soft delete) video
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(JSON.stringify({ message: "Video ID is required" }), { status: 400 });
        }

        const existing = await prisma.videoStory.findUnique({ where: { id } });
        if (!existing) {
            return new Response(JSON.stringify({ message: "Video not found" }), { status: 404 });
        }

        const deletedVideo = await prisma.videoStory.update({
            where: { id },
            data: { deleted: 1 }, // soft delete
        });

        return new Response(
            JSON.stringify({ message: "Video deleted successfully", data: deletedVideo }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete video", error: error.message }),
            { status: 500 }
        );
    }
}

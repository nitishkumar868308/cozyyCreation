import prisma from "@/lib/prisma";

export async function GET(req) {
    try {
        const users = await prisma.user.findMany();
        return new Response(
            JSON.stringify({ message: "Users fetched successfully", data: users }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch users", error: error.message }),
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";

export async function GET(req) {
    const token = req.cookies.get("session")?.value;
    if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(session.id) },
        include: { carts: true, addresses: true, orders :true },
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Welcome", user }, { status: 200 });
}

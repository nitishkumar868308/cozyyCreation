import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
    const order_id = req.nextUrl.searchParams.get("order_id");
    console.log("order_id_verify_status" , order_id)
    if (!order_id) return new Response(JSON.stringify({ success: false }), { status: 400 });

    const order = await prisma.orders.findFirst({ where: { orderNumber: order_id } });
    if (!order) return new Response(JSON.stringify({ success: false }), { status: 404 });

    return new Response(JSON.stringify({ success: order.paymentStatus === "PAID", order }), { status: 200 });
}

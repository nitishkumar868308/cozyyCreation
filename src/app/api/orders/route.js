import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req) {
    try {
        const body = await req.json();
        // 1️⃣ Create order in DB without orderNumber first
        let orderRecord = await prisma.orders.create({
            data: {
                userId: body.user?.id || null,
                shippingName: body.shippingAddress?.name,
                shippingPhone: body.shippingAddress?.mobile,
                shippingAddress: body.shippingAddress?.address,
                shippingCity: body.shippingAddress?.city,
                shippingState: body.shippingAddress?.state,
                shippingPincode: body.shippingAddress?.pincode,
                billingName: body.billingAddress?.name,
                billingPhone: body.billingAddress?.phone,
                billingAddress: body.billingAddress?.address,
                billingCity: body.billingAddress?.city,
                billingState: body.billingAddress?.state,
                billingPincode: body.billingAddress?.pincode,
                items: body.items,
                subtotal: parseFloat(body.subtotal.replace(/[^0-9.]/g, "")) || 0,
                shippingCharges: parseFloat(body.shipping.replace(/[^0-9.]/g, "")) || 0,
                discountAmount: body.discount || 0,
                taxAmount: body.tax || 0,
                totalAmount: parseFloat(body.total.replace(/[^0-9.]/g, "")) || 0,
                paymentMethod: body.paymentMethod, // dynamic
                status: "PENDING",
                paymentStatus: "PENDING",
            },
        });

        // 2️⃣ Generate orderNumber
        const orderNumber = `ORDER_${orderRecord.id}_${Date.now()}`;

        // 3️⃣ Update order with orderNumber
        orderRecord = await prisma.orders.update({
            where: { id: orderRecord.id },
            data: { orderNumber },
        });

        // 4️⃣ Update cat items to mark them as bought
        // await prisma.cart.updateMany({
        //     where: {
        //         id: { in: body.items.map(item => item.id) },
        //         is_buy: false,
        //     },
        //     data: { is_buy: true },
        // });

        // 5️⃣ Prepare customer details for Cashfree
        const customerEmail = body.user?.email || "example@gmail.com";
        const customerPhoneRaw = body.user?.phone || "+919999999999";
        const customerPhone = customerPhoneRaw.startsWith("+")
            ? customerPhoneRaw.replace(/\s+/g, "")
            : customerPhoneRaw;
        const customerId = `user_${body.user?.id || "1"}`;

        // 6️⃣ Create Cashfree payment session
        const response = await axios.post(
            "https://sandbox.cashfree.com/pg/orders",
            {
                order_amount: orderRecord.totalAmount,
                order_currency: "INR",
                order_id: orderNumber,
                customer_details: {
                    customer_id: customerId,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                },
                order_meta: {
                    //return_url: `${baseUrl}/payment-success?order_id=${orderNumber}`,
                    // notify_url: `${baseUrl}/api/orders/verify`,
                    notify_url: `${baseUrl}/api/orders/verify`,
                },
            },
            {
                headers: {
                    "x-client-id": process.env.CASHFREE_APP_ID || "no",
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY || "no",
                    "x-api-version": process.env.CASHFREE_VERSION || "no",
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("response" , response)
        if (!response.data.payment_session_id) {
            return new Response(
                JSON.stringify({ message: "No session ID in Cashfree response", data: response.data }),
                { status: 500 }
            );
        }

        // 7️⃣ Return DB ID + Cashfree sessionId to frontend
        return new Response(
            JSON.stringify({
                orderDbId: orderRecord.id,
                orderNumber: orderRecord.orderNumber,
                sessionId: response.data.payment_session_id,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        return new Response(
            JSON.stringify({ message: "Failed to create order", error: error.response?.data || error.message }),
            { status: 500 }
        );
    }
}

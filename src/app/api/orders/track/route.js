import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const trackingNumber = searchParams.get("tracking");

        if (!trackingNumber) {
            return NextResponse.json({ error: "Tracking number missing" }, { status: 400 });
        }

        console.log("Fetching:", `https://sandbox.envia.com/api/v1/shipments/${trackingNumber}`);

        const response = await fetch(
            `https://sandbox.envia.com/api/v1/shipments/${trackingNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ENVIA_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const text = await response.text();
            console.error("Envia Fetch Error:", text);
            return NextResponse.json({ error: "Failed to fetch Envia shipments" }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("Track API Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

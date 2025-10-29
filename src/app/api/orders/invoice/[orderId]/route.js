// app/api/orders/invoice/[orderId]/route.js
import { PrismaClient } from "@prisma/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const { orderId } = params;
        const order = await prisma.orders.findFirst({
            where: { orderNumber: orderId },
            include: { user: true },
        });

        if (!order) {
            return new Response(JSON.stringify({ message: "Order not found" }), { status: 404 });
        }

        // 🟦 Create PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 750]);
        const { height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const currencySymbol = order.paymentCurrency || "INR";

        // 🖼 Add Logo
        try {
            const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/image/logo PNG.png`;
            const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
            const logoImage = await pdfDoc.embedPng(logoBytes);
            const logoDims = logoImage.scale(0.5);
            page.drawImage(logoImage, { x: 50, y: height - 90, width: logoDims.width, height: logoDims.height });
        } catch (err) {
            console.warn("Logo not found or failed to load", err);
        }

        // 🧾 Title
        page.drawText("INVOICE", { x: 250, y: height - 60, size: 22, font, color: rgb(0, 0.2, 0.6) });

        // 🧍 Customer Info
        page.drawText(`Customer Name: ${order.user?.name || order.shippingName || "N/A"}`, { x: 50, y: height - 150, size: 12, font });
        page.drawText(`Email: ${order.user?.email || "N/A"}`, { x: 50, y: height - 170, size: 12, font });
        page.drawText(`Order ID: ${order.orderNumber}`, { x: 50, y: height - 190, size: 12, font });
        page.drawText(`Payment Status: ${order.paymentStatus}`, { x: 50, y: height - 210, size: 12, font });
        page.drawText(`Total Amount: ${currencySymbol} ${order.totalAmount}`, { x: 50, y: height - 230, size: 12, font });

        // 🧾 Footer
        page.drawText("Thank you for shopping with us!", { x: 50, y: 80, size: 12, font });
        page.drawText(`© ${new Date().getFullYear()} Hecate Wizard Mall`, { x: 50, y: 60, size: 10, font, color: rgb(0.4, 0.4, 0.4) });

        const pdfBytes = await pdfDoc.save();

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Invoice_${order.orderNumber}.pdf"`,
            },
        });

    } catch (err) {
        console.error("Invoice generation failed ❌:", err);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: err.message }), { status: 500 });
    }
}

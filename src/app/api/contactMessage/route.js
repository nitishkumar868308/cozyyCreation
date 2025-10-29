import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { contactConfirmationTemplate } from "@/lib/templates/contactConfirmation";
import {contactConfirmationTemplateAdmin} from '@/lib/templates/contactConfirmationAdmin'

// Create Contact Message
export async function POST(req) {
    try {
        const { name, email, message } = await req.json();

        if (!email || !name || !message) {
            return Response.json({ message: "All fields are required" }, { status: 400 });
        }

        const contactMessage = await prisma.contactMessage.create({
            data: { name, email, message },
        });

        // Send confirmation email to user
        await sendMail({
            to: email,
            subject: "Your message has been received!",
            text: `Hi ${name}, we received your message: "${message}".`,
            html: contactConfirmationTemplate({ name, email, message }),
        });

        // Send email to admin
        await sendMail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Message from ${name}`,
            text: `${name} (${email}) says: "${message}"`,
            html: contactConfirmationTemplateAdmin({ name, email, message }),
        });

        return Response.json({ message: "Message sent successfully!", contactMessage }, { status: 201 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

// Get all non-deleted messages
export async function GET(req) {
    try {
        const messages = await prisma.contactMessage.findMany({
            where: { isDeleted: false },
            orderBy: { createdAt: "desc" },
        });
        return Response.json({ messages }, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

// Update message
export async function PUT(req) {
    try {
        const { id, name, email, message } = await req.json();

        const updatedMessage = await prisma.contactMessage.update({
            where: { id },
            data: { name, email, message },
        });

        return Response.json({ message: "Message updated successfully!", updatedMessage }, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

// Soft Delete
export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const deletedMessage = await prisma.contactMessage.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        });

        return Response.json({ message: "Message deleted successfully!", deletedMessage }, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

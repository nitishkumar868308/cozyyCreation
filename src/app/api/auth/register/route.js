import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendMail } from "@/lib/mailer";
import { welcomeEmailTemplate } from "@/lib/templates/welcomeEmail";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return Response.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send email using the template
        await sendMail({
            to: user.email,
            subject: "Welcome to Hecate Wizard Mall!",
            text: `Hi ${user.name}, welcome to our platform! Your email: ${email}, Password: ${password}`,
            html: welcomeEmailTemplate({ name: user.name, email, password }),
        });

        return Response.json(
            { message: "User registered", user: { id: user.id, name: user.name, email: user.email }, token },
            { status: 201 }
        );
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

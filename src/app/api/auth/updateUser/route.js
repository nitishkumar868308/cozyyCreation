import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function PUT(req) {
    try {
        const { id, name, email, password, gender, phone, address, profileImage, country, state, city, pincode } = await req.json();

        if (!id) {
            return Response.json({ message: "User ID is required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        let updateData = { name, email, gender, phone, address, profileImage, country, state, city, pincode };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return Response.json(
            {
                message: "User updated successfully",
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    gender: updatedUser.gender,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                    profileImage: updatedUser.profileImage,
                    country: updatedUser.country,
                    state: updatedUser.state,
                    city: updatedUser.city,
                    pincode: updatedUser.pincode,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

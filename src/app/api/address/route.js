import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 Get all addresses
export async function GET(req) {
    try {
        const addresses = await prisma.address.findMany({
            orderBy: { createdAt: "desc" },
        });

        return new Response(
            JSON.stringify({ message: "Addresses fetched successfully", data: addresses }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to fetch addresses", error: error.message }),
            { status: 500 }
        );
    }
}

// 🟢 Add new address
// export async function POST(req) {
//     try {
//         const body = await req.json();
//         const { name, mobile, pincode, address, city, state, landmark, type, userId, customType, isDefault, country } = body;

//         if (!name || !mobile || !pincode || !address || !city || !state || !type) {
//             return new Response(
//                 JSON.stringify({ message: "All required fields must be provided" }),
//                 { status: 400 }
//             );
//         }

//         if (type === "Other" && !customType) {
//             return new Response(
//                 JSON.stringify({ message: "Custom type is required when type is 'Other'" }),
//                 { status: 400, headers: { "Content-Type": "application/json" } }
//             );
//         }

//         if (isDefault && userId) {
//             await prisma.address.updateMany({
//                 where: { userId, isDefault: true },
//                 data: { isDefault: false },
//             });
//         }

//         const newAddress = await prisma.address.create({
//             data: {
//                 name,
//                 mobile,
//                 pincode,
//                 address,
//                 city,
//                 state,
//                 landmark: landmark || null,
//                 type,
//                 customType,
//                 country,
//                 userId: userId || null,
//                 isDefault: isDefault || false,
//             },
//         });

//         return new Response(
//             JSON.stringify({ message: "Address added successfully", data: newAddress }),
//             { status: 201 }
//         );
//     } catch (error) {
//         return new Response(
//             JSON.stringify({ message: "Failed to add address", error: error.message }),
//             { status: 500 }
//         );
//     }
// }

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, mobile, pincode, address, city, state, landmark, type, userId, customType, isDefault, country } = body;

        // 🧩 Required fields
        if (!name || !mobile || !pincode || !address || !city || !state || !type || !country) {
            return new Response(
                JSON.stringify({ message: "All required fields must be provided" }),
                { status: 400 }
            );
        }

        // 🧩 Custom type validation
        if (type === "Other" && !customType) {
            return new Response(
                JSON.stringify({ message: "Custom type is required when type is 'Other'" }),
                { status: 400 }
            );
        }

        // 🧩 Duplicate prevention for Home/Office
        if (userId && (type === "Home" || type === "Office")) {
            const existingSameType = await prisma.address.findFirst({
                where: {
                    userId,
                    type,
                },
            });

            if (existingSameType) {
                return new Response(
                    JSON.stringify({
                        message: `You already have a ${type} address. Only one ${type} address is allowed.`,
                    }),
                    { status: 400 }
                );
            }
        }

        // 🧩 Handle default address
        if (isDefault && userId) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        // 🧩 Create new address
        const newAddress = await prisma.address.create({
            data: {
                name,
                mobile,
                pincode,
                address,
                city,
                state,
                country,
                landmark: landmark || null,
                type,
                customType,
                userId: userId || null,
                isDefault: isDefault || false,
            },
        });

        return new Response(
            JSON.stringify({ message: "Address added successfully", data: newAddress }),
            { status: 201 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to add address", error: error.message }),
            { status: 500 }
        );
    }
}


// 🟢 Update address
// export async function PUT(req) {
//     try {
//         const body = await req.json();
//         const { id, ...updates } = body;

//         if (!id) {
//             return new Response(
//                 JSON.stringify({ message: "Address ID is required" }),
//                 { status: 400 }
//             );
//         }

//         const existing = await prisma.address.findUnique({ where: { id } });
//         if (!existing) {
//             return new Response(
//                 JSON.stringify({ message: "Address not found" }),
//                 { status: 404 }
//             );
//         }

//         const updatedAddress = await prisma.address.update({
//             where: { id },
//             data: {
//                 ...updates,
//                 updatedAt: new Date(),
//             },
//         });

//         return new Response(
//             JSON.stringify({ message: "Address updated successfully", data: updatedAddress }),
//             { status: 200 }
//         );
//     } catch (error) {
//         return new Response(
//             JSON.stringify({ message: "Failed to update address", error: error.message }),
//             { status: 500 }
//         );
//     }
// }
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Address ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.address.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Address not found" }),
                { status: 404 }
            );
        }

        // 🧩 Prevent duplicate Home/Office type per user
        if (updates.userId && (updates.type === "Home" || updates.type === "Office")) {
            const duplicate = await prisma.address.findFirst({
                where: {
                    userId: updates.userId,
                    type: updates.type,
                    NOT: { id }, // exclude the one being updated
                },
            });

            if (duplicate) {
                return new Response(
                    JSON.stringify({
                        message: `You already have a ${updates.type} address. Only one ${updates.type} address is allowed.`,
                    }),
                    { status: 400 }
                );
            }
        }

        // 🧩 Optional: Prevent duplicate "Other" with same customType
        if (updates.userId && updates.type === "Other" && updates.customType) {
            const duplicateCustom = await prisma.address.findFirst({
                where: {
                    userId: updates.userId,
                    type: "Other",
                    customType: updates.customType,
                    NOT: { id },
                },
            });

            if (duplicateCustom) {
                return new Response(
                    JSON.stringify({
                        message: `You already have an 'Other' address of type '${updates.customType}'.`,
                    }),
                    { status: 400 }
                );
            }
        }

        // 🧩 Update default handling (if isDefault = true)
        if (updates.isDefault && updates.userId) {
            await prisma.address.updateMany({
                where: { userId: updates.userId, isDefault: true, NOT: { id } },
                data: { isDefault: false },
            });
        }

        // 🧩 Proceed to update
        const updatedAddress = await prisma.address.update({
            where: { id },
            data: {
                ...updates,
                updatedAt: new Date(),
            },
        });

        return new Response(
            JSON.stringify({
                message: "Address updated successfully",
                data: updatedAddress,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Failed to update address",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

// 🟢 Delete address
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Address ID is required" }),
                { status: 400 }
            );
        }

        const existing = await prisma.address.findUnique({ where: { id } });
        if (!existing) {
            return new Response(
                JSON.stringify({ message: "Address not found" }),
                { status: 404 }
            );
        }

        await prisma.address.delete({ where: { id } });

        return new Response(
            JSON.stringify({ message: "Address deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete address", error: error.message }),
            { status: 500 }
        );
    }
}

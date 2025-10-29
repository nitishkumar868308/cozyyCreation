import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/session";

export async function POST(req) {
  const { email, password } = await req.json();
  console.log("email" , email)

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }

  const token = createToken(user);
  const isProd = process.env.NODE_ENV === "production";
  console.log("isProd" , isProd)

  const response = NextResponse.json(
    { message: "Login successful", user },
    { status: 200 }
  );

  response.cookies.set("session", token, {
    httpOnly: true,
    //secure: isProd,
    secure: false,
    //sameSite: isProd ? "none" : "lax",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

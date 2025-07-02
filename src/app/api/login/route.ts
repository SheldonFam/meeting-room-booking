import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { generateToken } from "@/lib/jwt";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  // Compare hashed password
  const passwordMatch = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !passwordMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate JWT
  const token = await generateToken({
    id: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Set JWT as HTTP-only cookie
  const response = NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
  return response;
}

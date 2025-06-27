import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // For production: generate a JWT or set a session cookie here

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

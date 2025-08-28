import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Optionally, fetch fresh user info from DB
  const user = await prisma.user.findUnique({
    where: { id: Number(payload.id) },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase(),
  });
}

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
  const userId = Number(payload.id);
  if (!userId) {
    return NextResponse.json({ error: "User ID missing" }, { status: 400 });
  }

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  // Start of week (Monday)
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0=Sunday
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  try {
    const [total, upcoming, today, week] = await Promise.all([
      prisma.booking.count({ where: { userId } }),
      prisma.booking.count({ where: { userId, startTime: { gt: now } } }),
      prisma.booking.count({
        where: { userId, startTime: { gte: todayStart, lte: todayEnd } },
      }),
      prisma.booking.count({
        where: { userId, startTime: { gte: weekStart, lte: weekEnd } },
      }),
    ]);
    return NextResponse.json({ total, upcoming, today, week });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch booking stats" },
      { status: 500 }
    );
  }
}

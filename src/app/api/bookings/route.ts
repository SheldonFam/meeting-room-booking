import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

// GET /api/bookings - List all bookings (optionally filter by user or room)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const roomId = searchParams.get("roomId");

  const where: any = {};
  if (userId) where.userId = Number(userId);
  if (roomId) where.roomId = Number(roomId);

  try {
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "asc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(req: NextRequest) {
  // TODO: Implement logic to create a new booking
  return NextResponse.json({ message: "Create booking - not yet implemented" });
}

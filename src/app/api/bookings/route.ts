import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { verifyToken } from "@/lib/jwt";

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
  // Extract token from cookies
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Parse request body
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    roomId,
    startTime,
    endTime,
    meetingTitle,
    attendees,
    location,
    bookedBy,
    status,
    description,
  } = data || {};
  if (
    !roomId ||
    !startTime ||
    !endTime ||
    !meetingTitle ||
    !attendees ||
    !location ||
    !bookedBy ||
    !status
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: Number(payload.id),
        roomId: Number(roomId),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        meetingTitle,
        attendees,
        location,
        bookedBy,
        status,
        description,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

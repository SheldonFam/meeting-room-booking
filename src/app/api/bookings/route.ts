import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import { createBooking, getBookings } from "@/lib/bookingService";

const prisma = new PrismaClient();

// GET /api/bookings - List all bookings (optionally filter by user or room)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const filters = {
    userId: searchParams.get("userId"),
    roomId: searchParams.get("roomId"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    date: searchParams.get("date"),
  };

  try {
    const bookings = await getBookings(filters);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(req: NextRequest) {
  try {
    // Extract token from cookies
    const token = req.cookies.get("token")?.value;
    const body = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const booking = await createBooking(body, token);
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("create booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

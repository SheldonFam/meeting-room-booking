import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

// GET /api/rooms - List all rooms
export async function GET(req: NextRequest) {
  try {
    const rooms = await prisma.room.findMany();
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// POST /api/rooms - Add a new room (optional, for admin)
export async function POST(req: NextRequest) {
  // TODO: Implement logic to add a new room
  return NextResponse.json({ message: "Add new room - not yet implemented" });
}

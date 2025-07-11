import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Get today's date range
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStart = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  const todayEnd = new Date(`${yyyy}-${mm}-${dd}T23:59:59`);

  try {
    // Query DB for stats
    const [availableRooms, occupiedRooms, todaysMeetings, totalRooms] =
      await Promise.all([
        prisma.room.count({ where: { status: "available" } }),
        prisma.room.count({ where: { status: "occupied" } }),
        prisma.booking.count({
          where: { startTime: { gte: todayStart, lte: todayEnd } },
        }),
        prisma.room.count(),
      ]);

    // Utilization: percent of rooms booked today
    const utilization =
      totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return NextResponse.json({
      availableRooms,
      occupiedRooms,
      todaysMeetings,
      utilization,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

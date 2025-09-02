import { CreateBookingDTO } from "@/types/models";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function getBookings(filters: {
  userId?: string | null;
  roomId?: string | null;
  from?: string | null;
  to?: string | null;
  date?: string | null;
}) {
  const where: Prisma.BookingFindManyArgs["where"] = {};
  if (filters.userId) where.userId = Number(filters.userId);
  if (filters.roomId) where.roomId = Number(filters.roomId);

  // Date filtering logic
  if (filters.date) {
    // Filter bookings that start on this date
    const start = new Date(filters.date + "T00:00:00");
    const end = new Date(filters.date + "T23:59:59");
    where.startTime = { gte: start, lte: end };
  } else if (filters.from || filters.to) {
    where.startTime = {};
    if (filters.from) where.startTime.gte = new Date(filters.from);
    if (filters.to) where.startTime.lte = new Date(filters.to);
  }

  return prisma.booking.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      room: { select: { id: true, name: true } },
    },
    orderBy: { startTime: "asc" },
  });
}

export async function createBooking(data: CreateBookingDTO, token: string) {
  if (!token) throw new Error("Not authenticated");

  const payload = await verifyToken(token);

  if (!payload) throw new Error("Invalid token");

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
    !status ||
    !description
  ) {
    throw new Error("Missing required fields");
  }

  return prisma.booking.create({
    data: {
      userId: Number(payload.id),
      roomId: Number(roomId),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      meetingTitle,
      attendees,
      location,
      bookedBy,
      status: "pending",
      description,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      room: { select: { id: true, name: true } },
    },
  });
}

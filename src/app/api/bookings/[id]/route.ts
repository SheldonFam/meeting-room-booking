import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

// GET /api/bookings/[id] - Get booking details
export async function GET(
  _req: NextRequest,
  context: { params: { id: number } }
) {
  const { id } = context.params;
  const bookingId = id;

  if (isNaN(bookingId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        room: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookingId = Number(params.id);
  if (isNaN(bookingId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const updateData: Partial<{
      startTime: Date;
      endTime: Date;
      meetingTitle: string;
      attendees: number;
      location: string;
      bookedBy: string;
      status: string;
      description: string;
    }> = {};

    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);
    if (data.meetingTitle) updateData.meetingTitle = data.meetingTitle;
    if (data.attendees !== undefined) updateData.attendees = data.attendees;
    if (data.location) updateData.location = data.location;
    if (data.bookedBy) updateData.bookedBy = data.bookedBy;
    if (data.status) updateData.status = data.status;
    if (data.description !== undefined)
      updateData.description = data.description;

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

// DELETE /api/bookings/[id] - Delete booking
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookingId = Number(params.id);
  if (isNaN(bookingId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({ message: `Booking ${bookingId} deleted` });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

"use client";

import { useState } from "react";
import { BookingCard } from "@/components/ui/booking-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface Booking {
  meetingTitle: string;
  location: string;
  attendees: string;
  bookedBy: string;
  date: string;
  time: string;
  status: BookingStatus;
}

export default function MyBookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Sample data - replace with actual data from your API
  const bookings: Booking[] = [
    {
      meetingTitle: "Team Sync",
      location: "Conference Room A",
      attendees: "5",
      bookedBy: "John Doe",
      date: "Today",
      time: "10:00 AM - 11:00 AM",
      status: "confirmed",
    },
    {
      meetingTitle: "Client Meeting",
      location: "Board Room",
      attendees: "8",
      bookedBy: "Jane Smith",
      date: "Tomorrow",
      time: "2:00 PM - 3:00 PM",
      status: "pending",
    },
    {
      meetingTitle: "Project Review",
      location: "Meeting Room B",
      attendees: "4",
      bookedBy: "Mike Johnson",
      date: "Jun 15",
      time: "11:00 AM - 12:00 PM",
      status: "cancelled",
    },
  ];

  const statuses: BookingStatus[] = ["confirmed", "pending", "cancelled"];

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = !selectedStatus || booking.status === selectedStatus;
    // Add date filtering logic here when you implement the date picker
    return matchesStatus;
  });

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "secondary"}
                  className="capitalize"
                  onClick={() =>
                    setSelectedStatus(selectedStatus === status ? null : status)
                  }
                >
                  {status}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Date:</span>
              <DatePicker />
              {selectedDate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(null)}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((booking, index) => (
            <BookingCard key={index} {...booking} />
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No bookings found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

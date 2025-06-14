"use client";

import { SmallCard } from "@/components/ui/small-card";
import { BookingCard } from "@/components/ui/booking-card";
import { RoomCard } from "@/components/ui/room-card";
import Image from "next/image";

export default function DashboardPage() {
  // Sample data - replace with actual data from your API
  const stats = [
    {
      iconUrl: "/images/room.svg",
      title: "Total Rooms",
      description: 12,
    },
    {
      iconUrl: "/images/available.svg",
      title: "Available Rooms",
      description: 5,
    },
    {
      iconUrl: "/images/booking.svg",
      title: "Today's Bookings",
      description: 8,
    },
  ];

  const recentBookings = [
    {
      meetingTitle: "Team Sync",
      location: "Conference Room A",
      attendees: "5",
      bookedBy: "John Doe",
      date: "Today",
      time: "10:00 AM - 11:00 AM",
      status: "confirmed" as const,
    },
    {
      meetingTitle: "Client Meeting",
      location: "Board Room",
      attendees: "8",
      bookedBy: "Jane Smith",
      date: "Today",
      time: "2:00 PM - 3:00 PM",
      status: "pending" as const,
    },
  ];

  const availableRooms = [
    {
      id: 1,
      name: "Conference Room A",
      capacity: 10,
      location: "Floor 1, West Wing",
      roomDescription:
        "A spacious room suitable for team meetings and presentations.",
      facilities: ["Projector", "Whiteboard", "Video Conferencing"],
      status: "available" as const,
      imageUrl: "/images/room1.jpg",
    },
    {
      id: 2,
      name: "Meeting Room B",
      capacity: 6,
      location: "Floor 1, West Wing",
      roomDescription: "Perfect for small team meetings.",
      facilities: ["TV Screen", "Whiteboard"],
      status: "available" as const,
      imageUrl: "/images/room2.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <SmallCard
              key={index}
              iconUrl={stat.iconUrl}
              title={stat.title}
              description={stat.description}
            />
          ))}
        </div>

        {/* Recent Bookings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBookings.map((booking, index) => (
              <BookingCard key={index} {...booking} />
            ))}
          </div>
        </div>

        {/* Available Rooms Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.map((room) => (
              <RoomCard
                key={room.id}
                {...room}
                onBook={() => console.log(`Book ${room.name}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

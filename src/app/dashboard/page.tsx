"use client";

import { SmallCard } from "@/components/ui/small-card";
import { BookingCard } from "@/components/ui/booking-card";
import { RoomCard } from "@/components/ui/room-card";
import { MapPin, Calendar, TrendingUp, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // Sample data - replace with actual data from your API
  const stats = [
    {
      icon: <MapPin />,
      title: "Available Rooms",
      description: 5,
      iconBg: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-300",
    },
    {
      icon: <MapPin />,
      title: "Occupied Rooms",
      description: 1,
      iconBg: "bg-red-100 dark:bg-red-900",
      iconColor: "text-red-600 dark:text-red-300",
    },
    {
      icon: <Calendar />,
      title: "Today's Meetings",
      description: 2,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      icon: <TrendingUp />,
      title: "Utilization ",
      description: 17 + "%",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
  ];

  const upcomingBookings = [
    {
      meetingTitle: "Team Standup",
      description: "Daily team sync-up meeting",
      location: "Conference Room A",
      attendees: "8",
      bookedBy: "John Doe",
      date: "June 15",
      time: "10:00 AM - 11:00 AM",
      status: "confirmed" as const,
    },
    {
      meetingTitle: "Board Meeting",
      description: "Monthly board meeting",
      location: "Board Room",
      attendees: "15",
      bookedBy: "Jane Smith",
      date: "June 16",
      time: "2:00 PM - 3:00 PM",
      status: "pending" as const,
    },
    {
      meetingTitle: "Client Call",
      description: "Weekly client check-in",
      location: "Meeting Room B",
      attendees: "4",
      bookedBy: "Mike Johnson",
      date: "June 16",
      time: "9:30 PM - 10:30 PM",
      status: "pending" as const,
    },
  ];

  const todaySchedule = [
    {
      meetingTitle: "Project Kickoff",
      description: "Initial meeting to discuss project scope",
      location: "Conference Room A",
      attendees: "10",
      bookedBy: "Alice Brown",
      date: "June 15",
      time: "1:00 PM - 2:00 PM",
      status: "confirmed" as const,
    },
    {
      meetingTitle: "Design Review",
      description: "Review design mockups with the team",
      location: "Design Studio",
      attendees: "5",
      bookedBy: "Bob White",
      date: "June 15",
      time: "3:00 PM - 4:00 PM",
      status: "confirmed" as const,
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <Button variant="default">
            <Plus />
            Book a Room
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <SmallCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              description={stat.description}
              iconBg={stat.iconBg}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Upcoming Bookings Section */}
          <div className="mb-8 w-full border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Clock />
                Upcoming Bookings
              </h2>
              <Button variant="outline">View All</Button>
            </div>

            <div className="flex flex-col md:grid-cols-2 gap-4">
              {upcomingBookings.map((booking, index) => (
                <BookingCard key={index} {...booking} />
              ))}
            </div>
          </div>

          {/*Today Schedule Section */}
          <div className="mb-8 w-full border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Calendar /> Today Schedule
              </h2>
              <Button variant="outline">View Calendar</Button>
            </div>

            {/* View calendar button route to my-calendar, calendar pages not implement yet */}
            <div className="flex flex-col md:grid-cols-2 gap-4">
              {todaySchedule.map((booking, index) => (
                <BookingCard key={index} {...booking} />
              ))}
            </div>
          </div>
        </div>

        {/* Available Rooms Section */}
        <div className="mb-8 w-full border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <MapPin /> Available Rooms
            </h2>
            <Button variant="outline">View All Rooms</Button>
          </div>
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

"use client";

import { useState, useEffect } from "react";
import { BookingCard } from "@/components/ui/booking-card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Funnel, MapPin, Plus, Users } from "lucide-react";
import { SmallCard } from "@/components/ui/small-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const stats = [
    {
      icon: <Calendar />,
      title: "Total Bookings",
      description: 1,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      icon: <Clock />,
      title: "Upcoming",
      description: 1,
      iconBg: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-300",
    },
    {
      icon: <MapPin />,
      title: "Today",
      description: 0,
      iconBg: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-300",
    },
    {
      icon: <Users />,
      title: "This Week",
      description: 1,
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
  ];

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

  const [filter, setFilter] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
  }, []);

  if (!mounted) return null;

  const parseBookingDate = (dateStr: string): Date => {
    const lower = dateStr.toLowerCase();
    if (lower === "today") {
      return new Date(now!.getFullYear(), now!.getMonth(), now!.getDate());
    } else if (lower === "tomorrow") {
      return new Date(now!.getFullYear(), now!.getMonth(), now!.getDate() + 1);
    } else {
      return new Date(`${dateStr} ${now!.getFullYear()}`); // e.g., "Jun 15 2025"
    }
  };

  // const filteredBookings = bookings.filter((booking) => {
  //   const bookingDate = parseBookingDate(booking.date);
  //   if (filter === "upcoming") return bookingDate > now!;
  //   if (filter === "past") return bookingDate < now!;
  //   return true;
  // });

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p>Manage your meeting room reservations</p>
          </div>
          <Button variant="default">
            <Plus />
            Book another Room
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

        {/* Filters */}
        <div className="mb-8 space-y-4 border-gray-200 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex flex-col gap-4">
            <div className="flex  flex-row items-center gap-2">
              <Funnel />
              <p>Filter Bookings</p>
            </div>

            <div className="flex flex-col gap-2">
              <p>Status</p>
              <Select>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="flex flex-col gap-4">
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <BookingCard key={index} {...booking} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Clock />
                  <p className="text-gray-500 dark:text-gray-400">
                    No bookings available.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="upcoming">
            <div className="flex flex-col gap-4">
              {bookings.filter((b) => parseBookingDate(b.date) > now!).length >
              0 ? (
                bookings
                  .filter((b) => parseBookingDate(b.date) > now!)
                  .map((booking, index) => (
                    <BookingCard key={index} {...booking} />
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Clock />
                  <p className="text-gray-500 dark:text-gray-400">
                    No upcoming bookings found.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="flex flex-col gap-4">
              {bookings.filter((b) => parseBookingDate(b.date) < now!).length >
              0 ? (
                bookings
                  .filter((b) => parseBookingDate(b.date) < now!)
                  .map((booking, index) => (
                    <BookingCard key={index} {...booking} />
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Clock />
                  <p className="text-gray-500 dark:text-gray-400">
                    No past bookings found.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

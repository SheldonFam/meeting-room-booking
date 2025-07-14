"use client";

import { SmallCard } from "@/components/ui/small-card";
import { BookingCard } from "@/components/ui/booking-card";
import { RoomCard, RoomCardSkeleton } from "@/components/ui/room-card";
import { BookingCardSkeleton } from "@/components/ui/booking-card";
import {
  MapPin,
  Calendar,
  TrendingUp,
  Plus,
  Clock,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useBookings } from "@/hooks/useBookings";
import { useRooms } from "@/hooks/useRooms";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Helper to map booking API data to BookingCard props
function mapBookingToCard(booking: any) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  // Format date as 'Month Day' (e.g., 'June 15')
  const date = start.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
  // Format time as 'HH:MM AM/PM - HH:MM AM/PM'
  const time = `${start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  return {
    ...booking,
    date,
    time,
    meetingTitle: booking.meetingTitle || booking.title,
    attendees: booking.attendees?.toString() || "",
    bookedBy: booking.bookedBy || (booking.user?.name ?? ""),
    location: booking.location || (booking.room?.name ?? ""),
    status: booking.status || "confirmed",
  };
}

// Stats metadata
const STATS_META = [
  {
    key: "availableRooms",
    icon: <MapPin />,
    title: "Available Rooms",
    iconBg: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-300",
  },
  {
    key: "occupiedRooms",
    icon: <MapPin />,
    title: "Occupied Rooms",
    iconBg: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600 dark:text-red-300",
  },
  {
    key: "todaysMeetings",
    icon: <Calendar />,
    title: "Today's Meetings",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    key: "utilization",
    icon: <TrendingUp />,
    title: "Utilization",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-300",
    format: (val: number) => `${val}%`,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  // Use the new stats hook
  const {
    stats,
    loading: isLoadingStats,
    error: statsError,
  } = useDashboardStats();
  // Use the new user profile hook
  const { user, loading: isLoadingUser, error: userError } = useUserProfile();
  // Get today's date in YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  // Use the new bookings hook
  const {
    bookings: upcomingBookings,
    loading: isLoadingUpcoming,
    error: upcomingError,
  } = useBookings(user?.id ? { userId: user.id, from: todayStr } : {});
  const {
    bookings: todaySchedule,
    loading: isLoadingToday,
    error: todayError,
  } = useBookings(user?.id ? { userId: user.id, date: todayStr } : {});
  // Use the new rooms hook
  const {
    rooms: availableRooms,
    loading: isLoadingRooms,
    error: roomsError,
  } = useRooms();
  const skeletonCount = availableRooms.length || 3;

  // --- Frontend filtering to ensure no past bookings are shown ---
  const now = new Date();
  // Filter upcoming bookings: only show bookings with startTime >= now
  const filteredUpcomingBookings = upcomingBookings.filter(
    (booking) => new Date(booking.startTime) >= now
  );
  // Filter today schedule: only show bookings with startTime on today (ignore time zone issues)
  const filteredTodaySchedule = todaySchedule.filter((booking) => {
    const start = new Date(booking.startTime);
    return (
      start.getFullYear() === today.getFullYear() &&
      start.getMonth() === today.getMonth() &&
      start.getDate() === today.getDate()
    );
  });

  // Error toasts
  useEffect(() => {
    if (statsError) toast.error("Failed to load dashboard stats");
  }, [statsError]);
  useEffect(() => {
    if (userError) toast.error("Failed to load user profile");
  }, [userError]);
  useEffect(() => {
    if (upcomingError || todayError) toast.error("Failed to load bookings");
  }, [upcomingError, todayError]);
  useEffect(() => {
    if (roomsError) toast.error("Failed to load rooms");
  }, [roomsError]);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p>Welcome back! Here&#39;s what&#39;s happening today.</p>
          </div>
          <Button variant="default" onClick={() => router.push("/rooms")}>
            <Plus />
            Book a Room
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {isLoadingStats
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-24 w-full rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse"
                />
              ))
            : STATS_META.map((meta) => (
                <SmallCard
                  key={meta.key}
                  icon={meta.icon}
                  title={meta.title}
                  description={
                    meta.format
                      ? meta.format(stats[meta.key] as number)
                      : stats[meta.key] ?? "-"
                  }
                  iconBg={meta.iconBg}
                  iconColor={meta.iconColor}
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
              <Button
                variant="outline"
                onClick={() => router.push("/my-bookings")}
              >
                View All
              </Button>
            </div>

            <div className="flex flex-col md:grid-cols-2 gap-4">
              {isLoadingUser || isLoadingUpcoming ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <BookingCardSkeleton key={idx} />
                ))
              ) : filteredUpcomingBookings.length > 0 ? (
                filteredUpcomingBookings.map((booking, index) => (
                  <BookingCard
                    key={booking.id || index}
                    {...mapBookingToCard(booking)}
                  />
                ))
              ) : (
                <div className="text-gray-500">No upcoming bookings.</div>
              )}
            </div>
          </div>

          {/*Today Schedule Section */}
          <div className="mb-8 w-full border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Calendar /> Today Schedule
              </h2>
              <Button
                variant="outline"
                onClick={() => router.push("/calendar")}
              >
                View Calendar
              </Button>
            </div>

            {/* View calendar button route to my-calendar, calendar pages not implement yet */}
            <div className="flex flex-col md:grid-cols-2 gap-4">
              {isLoadingUser || isLoadingToday ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <BookingCardSkeleton key={idx} />
                ))
              ) : filteredTodaySchedule.length > 0 ? (
                filteredTodaySchedule.map((booking, index) => (
                  <BookingCard
                    key={booking.id || index}
                    {...mapBookingToCard(booking)}
                  />
                ))
              ) : (
                <div className="text-gray-500">No bookings for today.</div>
              )}
            </div>
          </div>
        </div>

        {/* Available Rooms Section */}
        <div className="mb-8 w-full border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <MapPin /> Available Rooms
            </h2>
            <Button variant="outline" onClick={() => router.push("/rooms")}>
              View All Rooms
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingRooms ? (
              Array.from({ length: skeletonCount }).map((_, index) => (
                <RoomCardSkeleton key={index} />
              ))
            ) : availableRooms.length > 0 ? (
              availableRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  capacity={room.capacity || 0}
                  facilities={room.facilities || []}
                  location={room.location}
                  roomDescription={room.roomDescription}
                  imageUrl={room.imageUrl || "/images/room1.jpg"}
                  status={room.status || "available"}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Building
                  size={64}
                  className="mb-4 text-gray-400 dark:text-gray-600"
                />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No rooms available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

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
import { useEffect, useMemo } from "react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRooms } from "@/hooks/useRoomsApi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  mapBookingToCard,
  isUpcoming,
  isToday,
  formatUtilization,
} from "@/lib/utils";
import type { Booking, DashboardStats, Room } from "@/types/models";
import { useBookingsWithFilters } from "@/hooks/useBookingsApi";

// Stats metadata
const STATS_META: {
  key: keyof DashboardStats;
  icon: React.ReactNode;
  title: string;
  iconBg: string;
  iconColor: string;
  format?: (val: number) => string;
}[] = [
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
    format: formatUtilization,
  },
];

function DashboardSection({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 w-full border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {icon} {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function BookingList({
  bookings,
  loading,
  error,
  emptyText,
}: {
  bookings: Booking[];
  loading: boolean;
  error?: string;
  emptyText: string;
}) {
  if (loading)
    return Array.from({ length: 3 }).map((_, idx) => (
      <BookingCardSkeleton key={idx} />
    ));
  if (error) return <div className="text-red-500">{error}</div>;
  if (!bookings.length) return <div className="text-gray-500">{emptyText}</div>;
  return bookings.map((booking, idx) => (
    <BookingCard key={booking.id || idx} {...mapBookingToCard(booking)} />
  ));
}

function RoomList({
  rooms,
  loading,
  error,
}: {
  rooms: Room[];
  loading: boolean;
  error?: string;
}) {
  if (loading)
    return Array.from({ length: rooms.length || 3 }).map((_, idx) => (
      <RoomCardSkeleton key={idx} />
    ));
  if (error) return <div className="text-red-500">{error}</div>;
  if (!rooms.length)
    return (
      <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Building size={64} className="mb-4 text-gray-400 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No rooms available.
        </p>
      </div>
    );
  return rooms.map((room) => (
    <RoomCard
      key={room.id}
      id={room.id}
      name={room.name}
      capacity={room.capacity || 0}
      facilities={room.facilities || []}
      location={room.location}
      roomDescription={room.roomDescription}
      imageUrl={room.imageUrl || "/images/room1.jpg"}
      status={
        (room.status as "available" | "occupied" | "maintenance") || "available"
      }
    />
  ));
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useDashboardStats();
  const { user, loading: isLoadingUser, error: userError } = useAuth();

  // Memoize today's date to prevent unnecessary recalculations
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, [today]);

  const {
    data: upcomingBookings = [],
    isLoading: isLoadingUpcoming,
    error: upcomingError,
  } = useBookingsWithFilters(
    user?.id ? { userId: user.id, from: todayStr } : {}
  );

  const {
    data: todaySchedule = [],
    isLoading: isLoadingToday,
    error: todayError,
  } = useBookingsWithFilters(
    user?.id ? { userId: user.id, date: todayStr } : {}
  );
  const {
    data: availableRooms = [],
    isLoading: isLoadingRooms,
    error: roomsError,
  } = useRooms();

  // Memoize current time to prevent unnecessary recalculations
  const now = useMemo(() => new Date(), []);

  // Memoize filtered bookings to prevent unnecessary recalculations
  const filteredUpcomingBookings = useMemo(
    () => upcomingBookings.filter((booking) => isUpcoming(booking, now)),
    [upcomingBookings, now]
  );

  const filteredTodaySchedule = useMemo(
    () => todaySchedule.filter((booking) => isToday(booking, today)),
    [todaySchedule, today]
  );

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
            <Plus /> Book A Room
          </Button>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {isLoadingStats || !stats
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
                      ? meta.format(stats[meta.key])
                      : stats[meta.key] ?? "-"
                  }
                  iconBg={meta.iconBg}
                  iconColor={meta.iconColor}
                />
              ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <DashboardSection
            title="Upcoming Bookings"
            icon={<Clock />}
            action={
              <Button
                variant="outline"
                onClick={() => router.push("/my-bookings")}
              >
                View All
              </Button>
            }
          >
            <BookingList
              bookings={filteredUpcomingBookings}
              loading={isLoadingUser || isLoadingUpcoming}
              error={upcomingError ? upcomingError.message : undefined}
              emptyText="No upcoming bookings."
            />
          </DashboardSection>
          <DashboardSection
            title="Today Schedule"
            icon={<Calendar />}
            action={
              <Button
                variant="outline"
                onClick={() => router.push("/calendar")}
              >
                View Calendar
              </Button>
            }
          >
            <BookingList
              bookings={filteredTodaySchedule}
              loading={isLoadingUser || isLoadingToday}
              error={todayError ? todayError.message : undefined}
              emptyText="No bookings for today."
            />
          </DashboardSection>
        </div>
        <DashboardSection
          title="Available Rooms"
          icon={<MapPin />}
          action={
            <Button variant="outline" onClick={() => router.push("/rooms")}>
              View All Rooms
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RoomList
              rooms={availableRooms}
              loading={isLoadingRooms}
              error={roomsError ? roomsError.message : undefined}
            />
          </div>
        </DashboardSection>
      </div>
    </main>
  );
}

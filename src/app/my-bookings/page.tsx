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
import type { Booking } from "@/types/models";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type BookingStatus = "confirmed" | "pending" | "cancelled";

function BookingList({
  bookings,
  now,
  filter,
  statusFilter,
}: {
  bookings: Booking[];
  now: Date;
  filter: string;
  statusFilter: string;
}) {
  let filtered = bookings;
  if (filter === "upcoming")
    filtered = filtered.filter((b) => new Date(b.startTime) > now);
  if (filter === "past")
    filtered = filtered.filter((b) => new Date(b.startTime) < now);
  if (statusFilter && statusFilter !== "all")
    filtered = filtered.filter((b) => b.status === statusFilter);
  filtered = filtered
    .slice()
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

  if (!filtered.length) {
    return (
      <Alert
        variant="default"
        className="flex flex-col items-center justify-center h-64"
      >
        <Clock className="mb-2" />
        <span>No bookings found.</span>
      </Alert>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {filtered.map((booking) => (
        <BookingCard
          key={booking.id}
          meetingTitle={booking.meetingTitle}
          attendees={booking.attendees.toString()}
          location={booking.location}
          bookedBy={booking.bookedBy}
          time={
            new Date(booking.startTime).toLocaleTimeString("en-MY", {
              hour: "2-digit",
              minute: "2-digit",
            }) +
            " - " +
            new Date(booking.endTime).toLocaleTimeString("en-MY", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
          date={new Date(booking.startTime).toLocaleDateString()}
          status={booking.status as BookingStatus}
          description={booking.description}
        />
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="mb-8 space-y-4 border-gray-200 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-[300px]" />
        </div>
      </div>
    </div>
  );
}

function BookingListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(2)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

function BookingPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>
      <StatsSkeleton />
      <FiltersSkeleton />
      <div className="mb-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <BookingListSkeleton />
    </div>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = useAuth();
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useBookings({ userId: user?.id });
  const [statusFilter, setStatusFilter] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  // Booking stats state
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    today: 0,
    week: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    setStatsLoading(true);
    setStatsError(null);
    fetch("/api/user/booking-stats", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => setStatsError(err.message))
      .finally(() => setStatsLoading(false));
  }, [user?.id]);

  if (userLoading || bookingsLoading || !mounted || !now || statsLoading) {
    return <BookingPageSkeleton />;
  }
  if (userError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{userError.message}</AlertDescription>
      </Alert>
    );
  }
  if (bookingsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{bookingsError.message}</AlertDescription>
      </Alert>
    );
  }
  if (statsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{statsError}</AlertDescription>
      </Alert>
    );
  }

  const statsArray = [
    {
      icon: <Calendar />,
      title: "Total Bookings",
      description: stats.total,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      icon: <Clock />,
      title: "Upcoming",
      description: stats.upcoming,
      iconBg: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-300",
    },
    {
      icon: <MapPin />,
      title: "Today",
      description: stats.today,
      iconBg: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-300",
    },
    {
      icon: <Users />,
      title: "This Week",
      description: stats.week,
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p>Manage your meeting room reservations</p>
          </div>
          <Button variant="default" onClick={() => router.push("/rooms")}>
            <Plus /> Book Another Room
          </Button>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {statsArray.map((stat, index) => (
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <BookingList
              bookings={bookings}
              now={now}
              filter="all"
              statusFilter={statusFilter}
            />
          </TabsContent>
          <TabsContent value="upcoming">
            <BookingList
              bookings={bookings}
              now={now}
              filter="upcoming"
              statusFilter={statusFilter}
            />
          </TabsContent>

          <TabsContent value="past">
            <BookingList
              bookings={bookings}
              now={now}
              filter="past"
              statusFilter={statusFilter}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

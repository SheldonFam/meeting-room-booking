"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveLeft, MapPin, Clock, Users, Calendar } from "lucide-react";
import { SmallCard } from "@/components/ui/small-card";
import { BookingForm } from "@/components/booking-form";
import { BookingEvent } from "@/types/booking-event";
import { toast } from "sonner";
import { useRoomDetails } from "@/hooks/useRoomDetails";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBookings } from "@/hooks/useBookings";
import { useCreateBooking } from "@/hooks/useCreateBooking";

function RoomStats({ capacity }: { capacity: number }) {
  const stats = [
    {
      icon: <Users />,
      title: "Capacity",
      description: `${capacity || 0} people`,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      icon: <Clock />,
      title: "Available Hours",
      description: "9.00 AM - 6.00 PM",
      iconBg: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-300",
    },
  ];
  return (
    <div className="flex flex-row gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex-1">
          <SmallCard {...stat} />
        </div>
      ))}
    </div>
  );
}

function FacilitiesList({ facilities }: { facilities: string[] }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm w-full mb-8">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Equipment & Amenities
      </p>
      <ul className="flex flex-wrap gap-y-2 list-none">
        {facilities.map((item, index) => (
          <li
            key={index}
            className="w-1/2 relative pl-4 text-gray-800 dark:text-gray-200 text-sm"
          >
            <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-cyan-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AvailabilitySection({
  timeSlots,
}: {
  timeSlots: { time: string; isAvailable: boolean }[];
}) {
  if (timeSlots.every((slot) => slot.isAvailable)) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Calendar size={30} />
        <p className="font-semibold text-lg">No bookings for today</p>
        <p>This room is available all day!</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {timeSlots.map((slot) => (
        <div
          key={slot.time}
          className={`p-3 rounded-md ${
            slot.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{slot.time}</span>
            <span>{slot.isAvailable ? "Available" : "Booked"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RoomBookingPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const router = useRouter();
  const roomId = String(params.id);
  const roomIdNum = Number(params.id);
  const { roomDetails, loading: isLoading, error } = useRoomDetails(roomId);
  const { user, loading: userLoading, error: userError } = useUserProfile();

  // Get today's date in YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const {
    bookings: todaysBookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useBookings({ roomId: roomIdNum, date: todayStr });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    createBooking,
    loading: creating,
    error: createError,
  } = useCreateBooking();

  // Generate time slots based on today's bookings (simple example, 9:00-17:00)
  const allSlots = [9, 10, 11, 12, 13, 14, 15, 16];
  const timeSlots = allSlots.map((hour) => {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    const isAvailable = !todaysBookings.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      return bookingStart.getHours() === hour;
    });
    return { time, isAvailable };
  });

  const handleBookingSubmit = async (
    data: Omit<BookingEvent, "id" | "roomId">
  ) => {
    setIsSubmitting(true);
    try {
      if (!user) throw new Error("User not loaded");

      const startTime = `${data.startDate}T${data.startTime}:00`;
      const endTime = `${data.endDate}T${data.endTime}:00`;

      const bookingPayload = {
        roomId: roomIdNum,
        startTime,
        endTime,
        meetingTitle: data.title,
        attendees: data.attendees,
        location: roomDetails?.name || "",
        bookedBy: user.name,
        status: "confirmed",
        description: data.description,
      };

      await createBooking(bookingPayload);
      toast.success("Booking created successfully!");
      router.push("/my-bookings");
    } catch (err: any) {
      toast.error(
        err.message || "An error occurred while creating the booking."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || userLoading || bookingsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
          </div>
          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
            {/* Stats Skeleton */}
            <div className="flex flex-row gap-4">
              <div className="flex-1 h-16 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 h-16 bg-gray-200 rounded animate-pulse" />
            </div>
            {/* Facilities Skeleton */}
            <div className="h-16 bg-gray-200 rounded animate-pulse w-full mb-8" />
          </div>
          {/* Booking Form Skeleton */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-10 w-1/2 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-10 w-1/2 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Availability Skeleton */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || userError || bookingsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.push("/rooms")}
          className="mb-6"
        >
          <MoveLeft /> Back to Rooms
        </Button>
        <div className="text-center py-8">
          <p className="text-red-500">
            {error?.message || userError?.message || bookingsError?.message}
          </p>
        </div>
      </div>
    );
  }

  if (!roomDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.push("/rooms")}
          className="mb-6"
        >
          <MoveLeft /> Back to Rooms
        </Button>
        <div className="text-center py-8">
          <p className="text-gray-500">Room not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => router.push("/rooms")}
        className="mb-6"
      >
        <MoveLeft /> Back to Rooms
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Room Details and Booking Form */}
        <div className="space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={roomDetails.imageUrl}
              alt={roomDetails.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Column - Today's Schedule and Availability */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{roomDetails.name}</h1>
            <p className="text-gray-600">{roomDetails.roomDescription}</p>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin />
              {roomDetails.location}
            </p>
            <p className="text-sm text-gray-500">
              Capacity: {roomDetails.capacity} people
            </p>
          </div>

          {/* Stats Section */}
          <RoomStats capacity={roomDetails.capacity} />

          <FacilitiesList facilities={roomDetails.facilities} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar /> Book {roomDetails.name}
          </p>
          <BookingForm
            onSubmit={handleBookingSubmit}
            maxAttendees={roomDetails.capacity}
            submitLabel="Book Room"
            loading={isSubmitting}
            rooms={roomDetails ? [roomDetails] : []}
            hideRoomSelect={true}
          />
          {createError && (
            <div className="text-red-500 mt-4">{createError.message}</div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Today&#39;s Availability
          </h2>

          <AvailabilitySection timeSlots={timeSlots} />
        </div>
      </div>
    </div>
  );
}

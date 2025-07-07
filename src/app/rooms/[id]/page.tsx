"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveLeft, MapPin, Clock, Users, Calendar } from "lucide-react";
import { SmallCard } from "@/components/ui/small-card";
import { BookingForm } from "@/components/booking-form";
import { BookingEvent } from "@/types/booking-event";
import { toast } from "sonner";

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface RoomDetails {
  id: number;
  name: string;
  capacity: number;
  imageUrl: string;
  location: string;
  roomDescription: string;
  facilities: string[];
  status: string;
}

export default function RoomBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch room details from API
  useEffect(() => {
    fetch(`/api/rooms/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setRoomDetails(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching room details:", error);
        setIsLoading(false);
      });
  }, [params.id]);

  // Mock time slots - replace with actual availability data
  const timeSlots: TimeSlot[] = [
    { time: "09:00", isAvailable: true },
    { time: "10:00", isAvailable: false },
    { time: "11:00", isAvailable: true },
    { time: "12:00", isAvailable: false },
    { time: "13:00", isAvailable: true },
    { time: "14:00", isAvailable: true },
    { time: "15:00", isAvailable: false },
    { time: "16:00", isAvailable: true },
  ];

  const stats = [
    {
      icon: <Users />,
      title: "Capacity",
      description: `${roomDetails?.capacity || 0} people`,
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

  const handleBookingSubmit = async (
    data: Omit<BookingEvent, "id" | "roomId">
  ) => {
    setIsSubmitting(true);
    // Construct ISO strings for startTime and endTime
    const startTime = `${data.startDate}T${data.startTime}:00`;
    const endTime = `${data.endDate}T${data.endTime}:00`;
    try {
      // Fetch user profile for bookedBy
      const userRes = await fetch("/api/user/profile");
      if (!userRes.ok) throw new Error("Failed to fetch user profile");
      const user = await userRes.json();
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: params.id,
          startTime,
          endTime,
          meetingTitle: data.title,
          attendees: data.attendees,
          location: roomDetails?.name || "",
          bookedBy: user.name,
          status: "confirmed",
          description: data.description,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to create booking");
        setIsSubmitting(false);
        return;
      }
      toast.success("Booking created successfully!");
      router.push("/my-bookings");
    } catch (err) {
      toast.error("An error occurred while creating the booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.push("/rooms")}
          className="mb-6"
        >
          <MoveLeft /> Back to Rooms
        </Button>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
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
          <div className="flex flex-row gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex-1">
                <SmallCard
                  icon={stat.icon}
                  title={stat.title}
                  description={stat.description}
                  iconBg={stat.iconBg}
                  iconColor={stat.iconColor}
                />
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm w-full mb-8">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Equipment & Amenities
            </p>
            <ul className="flex flex-wrap gap-y-2 list-none">
              {roomDetails.facilities.map((item, index) => (
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
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Today&#39;s Availability
          </h2>

          {timeSlots.every((slot) => slot.isAvailable) ? (
            <div className="flex flex-col items-center justify-center">
              <Calendar size={30} />
              <p className="font-semibold text-lg">No bookings for today</p>
              <p>This room is available all day!</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

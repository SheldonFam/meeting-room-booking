"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export default function RoomBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState("");

  // Mock data - replace with actual data fetching
  const roomDetails = {
    id: params.id,
    name: "Conference Room A",
    capacity: 10,
    image: "/images/room1.jpg",
    description: "Modern conference room with video conferencing facilities",
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add booking logic here
    console.log({
      roomId: params.id,
      startTime,
      endTime,
      title,
      description,
      attendees,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        Back to Rooms
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Room Details and Booking Form */}
        <div className="space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={roomDetails.image}
              alt={roomDetails.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{roomDetails.name}</h1>
            <p className="text-gray-600">{roomDetails.description}</p>
            <p className="text-sm text-gray-500">
              Capacity: {roomDetails.capacity} people
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Meeting Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter meeting title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter meeting description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <DatePicker />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.time} value={slot.time}>
                        {slot.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.time} value={slot.time}>
                        {slot.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Attendees
              </label>
              <Input
                type="number"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                min="1"
                max={roomDetails.capacity}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Book Room
            </Button>
          </form>
        </div>

        {/* Right Column - Today's Schedule and Availability */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
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
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Availability</h2>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={`p-2 rounded text-center text-sm ${
                    slot.isAvailable
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {slot.time}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

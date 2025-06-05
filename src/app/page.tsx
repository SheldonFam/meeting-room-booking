"use client";

import { Badge } from "./components/badge";
import { Dropdown, DropdownItem } from "./components/dropdown";
import { Tabs } from "./components/tab";
import { RoomCard } from "./components/room-card";
import { Button } from "./components/button";
import { PlusIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { BookingCard } from "./components/booking-card";
import { SmallCard } from "./components/small-card";
import { CustomDatePicker } from "./components/date-picker";
import { useState } from "react";

// Dynamically import the Calendar component and disable server-side rendering
const Calendar = dynamic(
  () => import("./components/calendar").then((mod) => mod.Calendar),
  {
    ssr: false,
    // Optionally, you can render a loading state while the component is loading
    // loading: () => <p>Loading Calendar...</p>,
  }
);

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const rooms = [
    {
      id: 1,
      name: "Conference Room A",
      capacity: 10,
      location: "Floor 1,West Wing",
      roomDescription:
        "A spacious room suitable for team meetings and presentations.",
      facilities: ["Projector", "Whiteboard", "Video Conferencing"],
      status: "available" as const,
      imageUrl: "/images/room1.jpg", // Use the imported image source
    },
    {
      id: 2,
      name: "Meeting Room B",
      capacity: 6,
      location: "Floor 1,West Wing",
      roomDescription:
        "A spacious room suitable for team meetings and presentations.",
      facilities: ["TV Screen", "Whiteboard"],
      status: "occupied" as const,
      imageUrl: "/images/room2.jpg", // Use the imported image source
    },
    {
      id: 3,
      name: "Board Room",
      capacity: 20,
      location: "Floor 1,West Wing",
      roomDescription:
        "A spacious room suitable for team meetings and presentations.",
      facilities: ["Projector", "Video Conferencing", "Catering"],
      status: "maintenance" as const,
      imageUrl: "/images/room1.jpg",
    },
    {
      id: 4,
      name: "Small Meeting Room",
      capacity: 4,
      location: "Floor 1,West Wing",
      roomDescription:
        "A spacious room suitable for team meetings and presentations.",
      facilities: ["TV Screen"],
      status: "available" as const,
      imageUrl: "/images/room1.jpg", // Use the imported image source
    },
    {
      id: 5,
      name: "Large Conference Hall",
      capacity: 50,
      location: "Floor 1,West Wing",
      roomDescription:
        "A spacious room suitable for team meetings and presentations.",
      facilities: [
        "Projector",
        "Sound System",
        "Microphones",
        "Video Conferencing",
        "Catering",
      ],
      status: "available" as const,
      imageUrl: "/images/room1.jpg", // Use the imported image source
    },
    {
      id: 6,
      name: "Focus Room 1",
      capacity: 1,
      location: "Floor 1,West Wing",
      roomDescription:
        "A spacious room suitable for team meetings and presentations.",
      facilities: ["Desk", "Monitor"],
      status: "occupied" as const,
      imageUrl: "/images/room1.jpg", // Use the imported image source
    },
  ];

  // const events = generateSampleEvents();

  const tabs = [
    {
      id: "all",
      label: "All Rooms",
      content: (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              {...room}
              onBook={() => console.log(`Book ${room.name}`)}
            />
          ))}
        </div>
      ),
    },
    {
      id: "available",
      label: "Available",
      content: (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms
            .filter((room) => room.status === "available")
            .map((room) => (
              <RoomCard
                key={room.id}
                {...room}
                onBook={() => console.log(`Book ${room.name}`)}
              />
            ))}
        </div>
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      content: (
        <div className="h-[600px]">
          <Calendar
            events={[]}
            onEventClick={(event) => {
              console.log("Event clicked:", event);
              // You can add a modal or notification here
              alert(
                `Event: ${event.title}\nTime: ${new Date(
                  event.startTime
                ).toLocaleTimeString()} - ${new Date(
                  event.endTime
                ).toLocaleTimeString()}\nDescription: ${event.description}`
              );
            }}
            onAddEvent={() => {
              console.log("Add event clicked");
              // You can add a modal or form here
              alert("Add new event functionality will be implemented here");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meeting Room Booking
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Beta</Badge>
              <Dropdown trigger={<>Settings</>}>
                <DropdownItem onClick={() => console.log("Profile")}>
                  Profile
                </DropdownItem>
                <DropdownItem onClick={() => console.log("Settings")}>
                  Settings
                </DropdownItem>
                <DropdownItem onClick={() => console.log("Logout")}>
                  Logout
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </header>

        <main>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sample Buttons
            </h2>
            <div className="flex gap-4 items-center mb-4">
              <Button variant="primary" size="sm">
                Primary Small
              </Button>
              <Button variant="secondary" size="md">
                Secondary Medium
              </Button>
              <Button isLoading>Loading Button</Button>
              <Button>
                <PlusIcon className="w-5 h-5 mr-2" />
                Button with icon
              </Button>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Date Picker Sample
              </h3>
              <div className="w-64">
                <CustomDatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  placeholderText="Select a date"
                  minDate={new Date()}
                />
              </div>
            </div>
            <div>
              <BookingCard
                meetingTitle="Board Meeting"
                location="Executive Room"
                attendees="5"
                bookedBy="John Doe"
                date="Jun 5"
                time="10:00AM - 11:00AM"
                status="confirmed"
              />
              <SmallCard
                iconUrl="next.svg"
                title="Available Rooms"
                description={5}
              />
            </div>
          </div>
          <Tabs tabs={tabs} defaultTab="calendar" />
        </main>
      </div>
    </div>
  );
}

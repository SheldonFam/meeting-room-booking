"use client";

import { Badge } from "./components/badge";
import { Dropdown, DropdownItem } from "./components/dropdown";
import { Tabs } from "./components/tab";
import { RoomCard } from "./components/room-card";
import { Calendar } from "./components/calendar";
import { Button } from "./components/button";

export default function Home() {
  const rooms = [
    {
      id: 1,
      name: "Conference Room A",
      capacity: 10,
      facilities: ["Projector", "Whiteboard", "Video Conferencing"],
      status: "available" as const,
    },
    {
      id: 2,
      name: "Meeting Room B",
      capacity: 6,
      facilities: ["TV Screen", "Whiteboard"],
      status: "occupied" as const,
    },
    {
      id: 3,
      name: "Board Room",
      capacity: 20,
      facilities: ["Projector", "Video Conferencing", "Catering"],
      status: "maintenance" as const,
    },
  ];

  // Generate sample events for the current week
  const generateSampleEvents = () => {
    const today = new Date();
    const events = [];

    // Team Meeting (Today at 10 AM)
    events.push({
      id: "1",
      title: "Team Meeting",
      startTime: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
      endTime: new Date(today.setHours(11, 30, 0, 0)).toISOString(),
      color: "blue",
      description: "Weekly team sync",
    });

    // Client Call (Today at 2 PM)
    events.push({
      id: "2",
      title: "Client Call",
      startTime: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
      endTime: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
      color: "pink",
      description: "Project review with client",
    });

    // Product Workshop (Tomorrow at 9 AM)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    events.push({
      id: "3",
      title: "Product Workshop",
      startTime: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString(),
      color: "blue",
      description: "Product roadmap planning",
    });

    // Lunch with Team (Tomorrow at 12:30 PM)
    events.push({
      id: "4",
      title: "Team Lunch",
      startTime: new Date(tomorrow.setHours(12, 30, 0, 0)).toISOString(),
      endTime: new Date(tomorrow.setHours(13, 30, 0, 0)).toISOString(),
      color: "pink",
      description: "Team building lunch",
    });

    // Code Review (Day after tomorrow at 3 PM)
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    events.push({
      id: "5",
      title: "Code Review",
      startTime: new Date(dayAfterTomorrow.setHours(15, 0, 0, 0)).toISOString(),
      endTime: new Date(dayAfterTomorrow.setHours(16, 30, 0, 0)).toISOString(),
      color: "blue",
      description: "Sprint code review session",
    });

    // All-hands Meeting (End of week)
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 4);
    events.push({
      id: "6",
      title: "All-hands Meeting",
      startTime: new Date(endOfWeek.setHours(16, 0, 0, 0)).toISOString(),
      endTime: new Date(endOfWeek.setHours(17, 0, 0, 0)).toISOString(),
      color: "pink",
      description: "Company-wide update meeting",
    });

    return events;
  };

  const events = generateSampleEvents();

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
            events={events}
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
            <div className="flex gap-4 items-center">
              <Button variant="primary" size="sm">
                Primary Small
              </Button>
              <Button variant="secondary" size="md">
                Secondary Medium
              </Button>
              <Button variant="outline" size="lg">
                Outline Large
              </Button>
              <Button variant="ghost">Ghost Default</Button>
              <Button isLoading>Loading Button</Button>
              <Button fullWidth className="mt-4">
                Full Width Button
              </Button>
            </div>
          </div>
          <Tabs tabs={tabs} defaultTab="calendar" />
        </main>
      </div>
    </div>
  );
}

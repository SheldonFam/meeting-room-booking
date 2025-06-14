"use client";

import { useState } from "react";
import { RoomCard } from "@/components/ui/room-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RoomStatus = "available" | "occupied" | "maintenance";

interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  roomDescription: string;
  facilities: string[];
  status: RoomStatus;
  imageUrl: string;
}

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  // Sample data - replace with actual data from your API
  const rooms: Room[] = [
    {
      id: 1,
      name: "Conference Room A",
      capacity: 10,
      location: "Floor 1, West Wing",
      roomDescription:
        "A spacious room suitable for team meetings and presentations.",
      facilities: ["Projector", "Whiteboard", "Video Conferencing"],
      status: "available",
      imageUrl: "/images/room1.jpg",
    },
    {
      id: 2,
      name: "Meeting Room B",
      capacity: 6,
      location: "Floor 1, West Wing",
      roomDescription: "Perfect for small team meetings.",
      facilities: ["TV Screen", "Whiteboard"],
      status: "available",
      imageUrl: "/images/room2.jpg",
    },
    {
      id: 3,
      name: "Board Room",
      capacity: 20,
      location: "Floor 2, East Wing",
      roomDescription: "Executive board room with premium facilities.",
      facilities: ["Projector", "Video Conferencing", "Catering"],
      status: "maintenance",
      imageUrl: "/images/room3.jpg",
    },
  ];

  const facilities = [
    "Projector",
    "Whiteboard",
    "Video Conferencing",
    "TV Screen",
    "Catering",
  ];
  const capacities = [4, 6, 10, 20, 50];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCapacity =
      !selectedCapacity || room.capacity >= selectedCapacity;
    const matchesFacility =
      !selectedFacility || room.facilities.includes(selectedFacility);

    return matchesSearch && matchesCapacity && matchesFacility;
  });

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Meeting Rooms</h1>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Capacity:</span>
              {capacities.map((capacity) => (
                <Button
                  key={capacity}
                  variant={
                    selectedCapacity === capacity ? "default" : "secondary"
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedCapacity(
                      selectedCapacity === capacity ? null : capacity
                    )
                  }
                >
                  {capacity}+
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Facilities:</span>
              {facilities.map((facility) => (
                <Button
                  key={facility}
                  variant={
                    selectedFacility === facility ? "default" : "secondary"
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedFacility(
                      selectedFacility === facility ? null : facility
                    )
                  }
                >
                  {facility}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              {...room}
              onBook={() => console.log(`Book ${room.name}`)}
            />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No rooms found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

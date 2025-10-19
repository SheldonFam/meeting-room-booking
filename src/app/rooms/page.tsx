"use client";

import { useState, useMemo } from "react";
import { RoomCard, RoomCardSkeleton } from "@/components/ui/room-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Funnel } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterRooms } from "@/lib/utils";
import { useRooms } from "@/hooks/useRoomsApi";
import { Room, RoomStatus } from "@/types/models";

function RoomList({ rooms, isLoading }: { rooms: Room[]; isLoading: boolean }) {
  if (isLoading) {
    return Array.from({ length: 6 }).map((_, index) => (
      <RoomCardSkeleton key={index} />
    ));
  }
  if (!rooms.length) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No rooms found matching your criteria.
        </p>
      </div>
    );
  }
  return rooms.map((room) => <RoomCard key={room.id} {...room} />);
}

export default function RoomsPage() {
  const { data: rawRooms = [], isLoading: isLoading, error } = useRooms();
  // Ensure status is RoomStatus type
  const rooms = rawRooms.map((room) => ({
    ...room,
    status: room.status as RoomStatus,
    imageUrl: room.imageUrl || "",
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Memoize unique values for filters
  const allLocations = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.location))).sort(),
    [rooms]
  );

  const capacityRanges = useMemo(
    () => [
      { label: "Small (1-6 people)", min: 1, max: 6 },
      { label: "Medium (7-15 people)", min: 7, max: 15 },
      { label: "Large (16+ people)", min: 16, max: Infinity },
    ],
    []
  );

  // Memoize filtered rooms to prevent unnecessary recalculations
  const filteredRooms = useMemo(
    () =>
      filterRooms(
        rooms,
        searchQuery,
        selectedStatus,
        selectedCapacity,
        selectedLocation,
        capacityRanges
      ),
    [
      rooms,
      searchQuery,
      selectedStatus,
      selectedCapacity,
      selectedLocation,
      capacityRanges,
    ]
  );

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedStatus(null);
    setSelectedCapacity(null);
    setSelectedLocation(null);
  };

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Meeting Rooms</h1>
        {/* Filters */}
        <div className="mb-8 space-y-4 border-gray-200 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Funnel />
                <p>Search & Filter</p>
              </div>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Search rooms by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="flex flex-col gap-4 xl:flex-row">
              <div className="flex flex-col gap-2">
                <p>Availability</p>
                <Select
                  value={selectedStatus || ""}
                  onValueChange={(value) =>
                    setSelectedStatus((value as RoomStatus) || null)
                  }
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="All Rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <p>Capacity</p>
                <Select
                  value={selectedCapacity || ""}
                  onValueChange={(value) => setSelectedCapacity(value || null)}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Any Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {capacityRanges.map((range) => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <p>Location</p>
                <Select
                  value={selectedLocation || ""}
                  onValueChange={(value) => setSelectedLocation(value || null)}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {allLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredRooms.length} of {rooms.length} rooms
          </p>
        </div>
        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RoomList rooms={filteredRooms} isLoading={isLoading} />
        </div>
        {error && <div className="text-red-500 mt-4">{error.message}</div>}
      </div>
    </main>
  );
}

import { Room, RoomDetails } from "@/types/models";
import { useQuery } from "@tanstack/react-query";

const ROOMS_KEY = "rooms";

// API functions
async function fetchRooms(): Promise<Room[]> {
  const res = await fetch("/api/rooms");
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}

async function fetchRoomDetails(roomId: string): Promise<RoomDetails> {
  const res = await fetch(`/api/rooms/${roomId}`);
  if (!res.ok) throw new Error("Failed to fetch room details");
  return res.json();
}

export function useRooms() {
  return useQuery<Room[]>({
    queryKey: [ROOMS_KEY],
    queryFn: fetchRooms,
  });
}

export function useRoomDetails(roomId: string) {
  return useQuery<RoomDetails>({
    queryKey: [ROOMS_KEY, roomId],
    queryFn: () => fetchRoomDetails(roomId),
    enabled: !!roomId,
  });
}

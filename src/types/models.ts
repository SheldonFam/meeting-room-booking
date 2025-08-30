// Centralized types for the app

import type { UseFormRegisterReturn } from "react-hook-form";
import type React from "react";

// Room status values for filtering and display
export type RoomStatus = "available" | "occupied" | "maintenance";

// Represents a meeting room entity
export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  roomDescription: string;
  facilities: string[];
  status: RoomStatus;
  imageUrl: string;
}

// Represents a booking record for a room
export interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  room: { id: number; name: string };
  user: { id: number; name: string; email: string };
  meetingTitle: string;
  attendees: number;
  location: string;
  bookedBy: string;
  status: string;
  description?: string;
}

// Payload for creating a new booking (used in API calls)
export interface CreateBookingPayload {
  roomId: number;
  startTime: string;
  endTime: string;
  meetingTitle: string;
  attendees: number;
  location: string;
  bookedBy: string;
  status: string;
  description?: string;
  color?: string;
}

// User object for authentication and context
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

// Context value for authentication provider

export interface AuthContextType {
  user: User | null;
  logout: () => void;
  loading: boolean;
  error: Error | null;
  fetchUser: () => Promise<User | null>;
}

// Detailed room info (used in room details page)
export interface RoomDetails {
  id: number;
  name: string;
  capacity: number;
  imageUrl: string;
  location: string;
  roomDescription: string;
  facilities: string[];
  status: string;
}

// Fields for the booking form (used with react-hook-form)
export type BookingFormFields = {
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  attendees: number;
  color: string;
  roomId: string;
};

// Props for the BookingForm component
export interface BookingFormProps {
  initialValues?: Partial<BookingEvent>;
  onSubmit: (data: Omit<BookingEvent, "id">) => void;
  maxAttendees?: number;
  submitLabel?: string;
  loading?: boolean;
  rooms: Array<{ id: number; name: string; location: string }>;
  hideRoomSelect?: boolean;
}

// Event object for calendar and booking form
export interface BookingEvent {
  id: string;
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  startTime: string;
  endTime: string;
  roomId: string;
  attendees: number;
  color?: string;
  createdBy?: string;
  editedBy?: string;

  // extra fields from API
  bookedBy?: string;
  location?: string;
  status?: string;
}

// Props for the BookingCard component (booking summary card)
export interface BookingCardProps {
  meetingTitle: string;
  attendees: string;
  location: string;
  bookedBy: string;
  time: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  className?: string;
  description?: string;
}

// Props for the SmallCard component (dashboard/stat card)
export interface SmallCardProps {
  icon: React.ReactNode;
  title: string;
  description: string | number;
  className?: string;
  iconBg?: string;
  iconColor?: string;
}

// Fields for the login form (used with react-hook-form)
export interface LoginFormFields {
  email: string;
  password: string;
}

// User role values for authentication
export type UserRole = "admin" | "user";

// Response from login API
export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Props for the reusable FormField component (login form)
export interface FormFieldProps {
  id: keyof LoginFormFields;
  label: string;
  type?: string;
  autoComplete?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

// Props for the RoomCard component (room summary card)
export interface RoomCardProps {
  id?: number;
  name: string;
  capacity: number;
  facilities: string[];
  location?: string;
  roomDescription?: string;
  imageUrl?: string;
  status: "available" | "occupied" | "maintenance";
  onBook?: () => void;
  className?: string;
  children?: React.ReactNode;
}

"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Booking {
  id: number;
  meetingTitle: string;
  attendees: number;
  location: string;
  bookedBy: string;
  status: string;
  description?: string;
  startTime: string;
  endTime: string;
  room: { id: number; name: string };
  user: { id: number; name: string; email: string };
}

const initialBookings: Booking[] = [
  {
    id: 1,
    meetingTitle: "Weekly Sync",
    attendees: 8,
    location: "Floor 1",
    bookedBy: "Alice",
    status: "pending",
    description: "Weekly team sync-up.",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    room: { id: 1, name: "Conference Room A" },
    user: { id: 1, name: "Alice", email: "alice@example.com" },
  },
  {
    id: 2,
    meetingTitle: "Project Kickoff",
    attendees: 12,
    location: "Floor 2",
    bookedBy: "Bob",
    status: "confirmed",
    description: "Kickoff for new project.",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    room: { id: 2, name: "Meeting Room B" },
    user: { id: 2, name: "Bob", email: "bob@example.com" },
  },
  {
    id: 3,
    meetingTitle: "Cancelled Meeting",
    attendees: 5,
    location: "Floor 3",
    bookedBy: "Carol",
    status: "cancelled",
    description: "This meeting was cancelled.",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 5400000).toISOString(),
    room: { id: 3, name: "Board Room" },
    user: { id: 3, name: "Carol", email: "carol@example.com" },
  },
];

const STATUS_TABS = [
  { value: "pending", label: "Pending Approval" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All Bookings" },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<string>("pending");

  // Delete
  const handleDelete = () => {
    if (!bookingToDelete) return;
    setBookings((prev) => prev.filter((b) => b.id !== bookingToDelete.id));
    setDeleteDialogOpen(false);
  };

  // Approve booking
  const handleApprove = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "confirmed" } : b))
    );
  };

  // Reject booking
  const handleReject = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );
  };

  // Tab-based filtering
  const getFilteredBookings = (status: string) => {
    if (status === "all") return bookings;
    return bookings.filter((b) => b.status === status);
  };

  // Count for badges
  const getCount = (status: string) =>
    status === "all"
      ? bookings.length
      : bookings.filter((b) => b.status === status).length;

  // Table rendering logic
  const renderTable = (filteredBookings: Booking[]) =>
    filteredBookings.length === 0 ? (
      <Alert
        variant="default"
        className="flex flex-col items-center justify-center h-64"
      >
        No bookings found.
      </Alert>
    ) : (
      <Table>
        <TableCaption className="mb-2">List of bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Title</TableHead>
            <TableHead className="w-1/12">Room</TableHead>
            <TableHead className="w-1/12">Booked By</TableHead>
            <TableHead className="w-1/12">Attendees</TableHead>
            <TableHead className="w-1/6">Start</TableHead>
            <TableHead className="w-1/6">End</TableHead>
            <TableHead className="w-1/12">Status</TableHead>
            <TableHead className="w-1/6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {booking.meetingTitle}
              </TableCell>
              <TableCell>{booking.room.name}</TableCell>
              <TableCell>{booking.bookedBy}</TableCell>
              <TableCell>{booking.attendees}</TableCell>
              <TableCell>
                {new Date(booking.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(booking.endTime).toLocaleString()}
              </TableCell>
              <TableCell>
                <span
                  className={
                    booking.status === "confirmed"
                      ? "inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : booking.status === "pending"
                      ? "inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "inline-block px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {booking.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 px-4"
                        onClick={() => handleApprove(booking.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-4"
                        onClick={() => handleReject(booking.id)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Removed Edit button and dialog for admin */}
                      <Dialog
                        open={
                          deleteDialogOpen && bookingToDelete?.id === booking.id
                        }
                        onOpenChange={(open) => {
                          setDeleteDialogOpen(open);
                          if (!open) setBookingToDelete(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 px-4"
                            onClick={() => {
                              setBookingToDelete(booking);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm w-full p-6 rounded-xl">
                          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                            Delete Booking
                          </h2>
                          <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Are you sure you want to delete{" "}
                            <b>{booking.meetingTitle}</b>?
                          </p>
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteDialogOpen(false)}
                              className="h-9 px-5"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              className="h-9 px-5"
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Manage Bookings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            View, edit, approve, reject, or remove bookings for all rooms.
          </p>
        </div>
        {/* Removed Add Booking button and dialog for admin */}
      </div>
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="relative">
              {tab.label}
              <span className="ml-2 inline-block min-w-[1.5em] px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 align-middle">
                {getCount(tab.value)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {STATUS_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="w-full">
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8" />
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-0 md:p-4">
              {renderTable(getFilteredBookings(tab.value))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

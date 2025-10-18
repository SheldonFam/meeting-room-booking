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
import {
  useAllBookings,
  useUpdateBookingStatus,
  useDeleteBooking,
} from "@/hooks/useBookingsApi";
import { toast } from "sonner";
import type { Booking } from "@/types/models";

const STATUS_TABS = [
  { value: "pending", label: "Pending Approval" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All Bookings" },
];

// Individual booking action component
function BookingActions({ booking }: { booking: Booking }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const updateBookingStatus = useUpdateBookingStatus();
  const deleteBooking = useDeleteBooking();

  const handleApprove = async () => {
    try {
      await updateBookingStatus.mutateAsync({
        bookingId: booking.id,
        status: "confirmed",
      });
      toast.success("Booking approved successfully!");
    } catch {
      toast.error("Failed to approve booking");
    }
  };

  const handleReject = async () => {
    try {
      await updateBookingStatus.mutateAsync({
        bookingId: booking.id,
        status: "cancelled",
      });
      toast.success("Booking rejected successfully!");
    } catch {
      toast.error("Failed to reject booking");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBooking.mutateAsync(booking.id);
      toast.success("Booking deleted successfully!");
      setDeleteDialogOpen(false);
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {booking.status === "pending" ? (
        <>
          <Button
            size="sm"
            variant="default"
            className="h-8 px-4"
            onClick={handleApprove}
            disabled={updateBookingStatus.isPending}
          >
            {updateBookingStatus.isPending ? "Processing..." : "Approve"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 px-4"
            onClick={handleReject}
            disabled={updateBookingStatus.isPending}
          >
            {updateBookingStatus.isPending ? "Processing..." : "Reject"}
          </Button>
        </>
      ) : (
        <>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 px-4"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm w-full p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Delete Booking
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete <b>{booking.meetingTitle}</b>?
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
                  disabled={deleteBooking.isPending}
                >
                  {deleteBooking.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<string>("pending");

  // Use TanStack Query hooks
  const { data: bookings = [], isLoading, error } = useAllBookings();

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
  const renderTable = (filteredBookings: Booking[]) => {
    if (isLoading) {
      return (
        <Alert
          variant="default"
          className="flex flex-col items-center justify-center h-64"
        >
          Loading bookings...
        </Alert>
      );
    }

    if (error) {
      return (
        <Alert
          variant="destructive"
          className="flex flex-col items-center justify-center h-64"
        >
          Failed to load bookings. Please try again.
        </Alert>
      );
    }

    if (filteredBookings.length === 0) {
      return (
        <Alert
          variant="default"
          className="flex flex-col items-center justify-center h-64"
        >
          No bookings found.
        </Alert>
      );
    }

    return (
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
                <BookingActions booking={booking} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

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

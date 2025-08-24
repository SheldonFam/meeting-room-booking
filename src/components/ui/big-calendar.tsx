"use client";

import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { BookingEvent } from "@/types/models";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  toLocalDateString,
  eventToInitialValues,
  mapBookingsToCalendarEvents,
  CalendarEvent,
  buildBookingPayload,
} from "@/lib/utils";
import { useBookingsApi } from "@/hooks/useBookingsApi";
import { BookingModal } from "./booking-modal";

export function BigCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { rooms, loading: loadingRooms } = useRooms();
  const { user } = useAuth();
  const { fetchBookingsForUser, createBooking, updateBooking } =
    useBookingsApi();

  useEffect(() => {
    async function fetchBookings() {
      try {
        if (!user) return setEvents([]);
        const bookingsData = await fetchBookingsForUser(String(user.id));
        const mappedEvents: CalendarEvent[] =
          mapBookingsToCalendarEvents(bookingsData);
        setEvents(mappedEvents);
        console.log("map", mappedEvents);
      } catch {
        setEvents([]);
      }
    }
    fetchBookings();
  }, [user, fetchBookingsForUser]);

  const handleDateSelect = (selectInfo?: { start: Date }) => {
    setSelectedEvent(null);
    setSelectedDate(selectInfo?.start || null);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openModal();
  };

  const handleBookingFormSubmit = async (data: Omit<BookingEvent, "id">) => {
    setIsSubmitting(true);
    try {
      const selectedRoom = rooms.find((r) => String(r.id) === data.roomId);
      const payload = buildBookingPayload(data, user, selectedRoom);
      if (selectedEvent) {
        await updateBooking(String(selectedEvent.id), payload);
        toast.success("Booking Updated Successfully!");
      } else {
        await createBooking(payload);
        toast.success("Booking Created Successfully!");
      }
      setSelectedEvent(null);
      closeModal();
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to create or update booking."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine initial values for BookingForm
  const today = toLocalDateString(new Date());
  const initialDate = selectedDate ? toLocalDateString(selectedDate) : today;
  const bookingFormInitialValues = selectedEvent
    ? eventToInitialValues(selectedEvent)
    : { startDate: initialDate, endDate: initialDate };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-2 sm:p-4 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={(selectInfo) => handleDateSelect(selectInfo)}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: () => handleDateSelect(),
            },
          }}
        />
      </div>

      <BookingModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleBookingFormSubmit}
        selectedEvent={selectedEvent}
        initialValues={bookingFormInitialValues}
        loading={isSubmitting || loadingRooms}
        rooms={rooms}
      />
    </div>
  );
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex flex-col sm:flex-row sm:items-center 
                  fc-event-main ${colorClass} 
                  p-1 sm:p-2 rounded-md gap-0.5 sm:gap-2`}
    >
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time text-xs sm:text-sm">
          {eventInfo.timeText}
        </div>
      </div>
      <div className="fc-event-title text-xs sm:text-sm leading-tight whitespace-normal">
        {eventInfo.event.title}
      </div>
    </div>
  );
};

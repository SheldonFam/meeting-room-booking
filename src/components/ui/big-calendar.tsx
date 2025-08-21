"use client";

import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking-form";
import { BookingEvent } from "@/types/models";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  toLocalDateString,
  isDate,
  eventToInitialValues,
  mapBookingsToCalendarEvents,
  CalendarEvent,
} from "@/lib/utils";
import { useBookingsApi } from "@/hooks/useBookingsApi";
import { BookingModal } from "./booking-modal";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { set } from "react-hook-form";

export function BigCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  // const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { rooms, loading: loadingRooms } = useRooms();
  const { user } = useAuth();
  const { events, addBooking, editBooking } = useCalendarBookings(user?.id);
  // const { fetchBookingsForUser, createBooking, updateBooking } =
  //   useBookingsApi();

  // useEffect(() => {
  //   async function fetchBookings() {
  //     try {
  //       if (!user) return setEvents([]);
  //       const bookingsData = await fetchBookingsForUser(String(user.id));
  //       console.log("Fetched bookings:", bookingsData);
  //       const mappedEvents: CalendarEvent[] =
  //         mapBookingsToCalendarEvents(bookingsData);
  //       setEvents(mappedEvents);
  //     } catch {
  //       setEvents([]);
  //     }
  //   }
  //   fetchBookings();
  // }, [user]);

  const handleDateSelect = (selectInfo?: { start: Date }) => {
    setSelectedEvent(null);
    setSelectedDate(selectInfo?.start || null);
    // if (selectInfo && selectInfo.start) {
    //   setSelectedDate(selectInfo.start);
    // } else {
    //   setSelectedDate(null);
    // }
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openModal();
  };

  const handleBookingFormSubmit = async (data: Omit<BookingEvent, "id">) => {
    setIsSubmitting(true);
    // try {
    //   const {
    //     title,
    //     description,
    //     startDate,
    //     endDate,
    //     color,
    //     attendees,
    //     startTime,
    //     endTime,
    //     roomId,
    //   } = data;
    //   const start = isDate(startDate)
    //     ? toLocalDateString(startDate)
    //     : startDate;
    //   const end = isDate(endDate) ? toLocalDateString(endDate) : endDate;
    //   const selectedRoom = rooms.find((r) => String(r.id) === roomId);
    //   const eventData: CalendarEvent = {
    //     id: selectedEvent ? selectedEvent.id : Date.now().toString(),
    //     title,
    //     start: `${start}T${startTime}:00`,
    //     end: `${end}T${endTime}:00`,
    //     extendedProps: {
    //       calendar: color ? String(color) : "Primary",
    //       description,
    //       attendees: attendees !== undefined ? Number(attendees) : 0,
    //       startTime,
    //       endTime,
    //       roomId: String(roomId),
    //     },
    //   };
    //   if (selectedEvent) {
    //     try {
    //       await updateBooking(String(selectedEvent.id), {
    //         title,
    //         description,
    //         startTime,
    //         endTime,
    //         attendees: attendees !== undefined ? Number(attendees) : 0,
    //         color: color ? String(color) : undefined,
    //         roomId: String(roomId),
    //         location: selectedRoom ? selectedRoom.location : "",
    //         bookedBy: user?.name || "",
    //         status: "confirmed",
    //         startDate: start,
    //         endDate: end,
    //       });
    //       setEvents((prevEvents) =>
    //         prevEvents.map((event) =>
    //           event.id === selectedEvent.id ? eventData : event
    //         )
    //       );
    //       toast.success("Booking Updated Successfully!");
    //     } catch {
    //       toast.error("Failed to update booking.");
    //     }
    //   } else {
    //     try {
    //       await createBooking({
    //         title,
    //         description,
    //         startTime,
    //         endTime,
    //         attendees: attendees !== undefined ? Number(attendees) : 0,
    //         color: color ? String(color) : undefined,
    //         roomId: String(roomId),
    //         location: selectedRoom ? selectedRoom.location : "",
    //         bookedBy: user?.name || "",
    //         status: "confirmed",
    //         startDate: start,
    //         endDate: end,
    //       });
    //       setEvents((prevEvents) => [...prevEvents, eventData]);
    //       toast.success("Booking Created Successfully!");
    //     } catch {
    //       toast.error("Failed to create booking.");
    //     }
    //   }
    //   setSelectedEvent(null);
    // } finally {
    //   setIsSubmitting(false);
    //   closeModal();
    // }

    try {
      if (selectedEvent) {
        if (!selectedEvent?.id) {
          throw new Error("Trying to edit a booking without an ID");
        }
        await editBooking(selectedEvent.id, data);
        toast.success("Booking Updated Successfully!");
      } else {
        await addBooking(data);
        toast.success("Booking Created Successfully!");
      }
      setSelectedEvent(null);
    } catch {
      toast.error("Failed to process booking.");
    } finally {
      setIsSubmitting(false);
      closeModal();
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
      {/* <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="p-4 sm:p-6 w-full max-w-full sm:max-w-lg h-full sm:h-auto sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Plan your next big moment: schedule or edit an event to stay on
              track
            </DialogDescription>
          </DialogHeader>
          <div>
            {loadingRooms || rooms.length === 0 ? (
              <div>Loading rooms...</div>
            ) : (
              <BookingForm
                initialValues={bookingFormInitialValues}
                onSubmit={handleBookingFormSubmit}
                submitLabel={selectedEvent ? "Update Changes" : "Add Event"}
                loading={isSubmitting}
                rooms={rooms}
              />
            )}
          </div>
        </DialogContent>
      </Dialog> */}

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

"use client";

import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { useModal } from "@/app/hooks/useModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookingForm } from "@/components/booking-form";
import { BookingEvent } from "@/types/booking-event";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    description?: string;
    attendees?: number;
    startTime?: string;
    endTime?: string;
  };
}

// Utility functions
const pad = (n: number) => n.toString().padStart(2, "0");
const toLocalDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

function isDate(val: unknown): val is Date {
  return Object.prototype.toString.call(val) === "[object Date]";
}

function eventToInitialValues(event: CalendarEvent): Partial<BookingEvent> {
  return {
    title: event.title,
    description: event.extendedProps?.description || "",
    startDate: event.start as string,
    endDate: (event.end as string) || (event.start as string),
    color: event.extendedProps?.calendar,
    attendees: event.extendedProps?.attendees || 0,
    startTime: event.extendedProps?.startTime || "",
    endTime: event.extendedProps?.endTime || "",
  };
}

export function BigCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    // Initialize with some default events
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success" },
      },
      {
        id: "3",
        title: "Workshop",
        start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        end: new Date(Date.now() + 259200000 - 86400000)
          .toISOString()
          .split("T")[0],
        extendedProps: { calendar: "Primary" },
      },
    ]);
  }, []);

  const handleDateSelect = (selectInfo?: { start: Date }) => {
    setSelectedEvent(null);
    if (selectInfo && selectInfo.start) {
      setSelectedDate(selectInfo.start);
    } else {
      setSelectedDate(null);
    }
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openModal();
  };

  const handleBookingFormSubmit = (
    data: Omit<BookingEvent, "id" | "roomId">
  ) => {
    const {
      title,
      description,
      startDate,
      endDate,
      color,
      attendees,
      startTime,
      endTime,
    } = data;
    const start = isDate(startDate) ? toLocalDateString(startDate) : startDate;
    let end = isDate(endDate) ? toLocalDateString(endDate) : endDate;
    if (start !== end) {
      const nextDay = parseLocalDate(end);
      if (nextDay) {
        nextDay.setDate(nextDay.getDate() + 1);
        end = toLocalDateString(nextDay);
      }
    }
    const eventData: CalendarEvent = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      title,
      start,
      end: end || start,
      extendedProps: {
        calendar: color || "Primary",
        description,
        attendees,
        startTime,
        endTime,
      },
    };
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? eventData : event
        )
      );
    } else {
      setEvents((prevEvents) => [...prevEvents, eventData]);
    }
    closeModal();
    setSelectedEvent(null);
  };

  // Determine initial values for BookingForm
  const today = toLocalDateString(new Date());
  const initialDate = selectedDate ? toLocalDateString(selectedDate) : today;
  const bookingFormInitialValues = selectedEvent
    ? eventToInitialValues(selectedEvent)
    : { startDate: initialDate, endDate: initialDate };

  return (
    <div className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="p-4 max-h-[100vh] overflow-y-auto sm:max-w-[700px] sm:max-h-[60vh] sm:overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Plan your next big moment: schedule or edit an event to stay on
              track
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <BookingForm
              initialValues={bookingFormInitialValues}
              onSubmit={handleBookingFormSubmit}
              submitLabel={selectedEvent ? "Update Changes" : "Add Event"}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

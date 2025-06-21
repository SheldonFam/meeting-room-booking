"use client";

// import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/app/hooks/useModal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

export function BigCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

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

  const handleDateSelect = (selectedInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectedInfo.startStr);
    let endDate = selectedInfo.endStr || selectedInfo.startStr;
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() - 1);
      endDate = end.toISOString().split("T")[0];
    }
    setEventEndDate(endDate);
    setEventLevel("Primary");
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(
      event.extendedProps && event.extendedProps.calendar
        ? event.extendedProps.calendar
        : "Primary"
    );
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (!eventTitle || !eventStartDate || !eventEndDate || !eventLevel) {
      alert("Please fill in all fields and select an event color.");
      return;
    }

    // Best practice: if start and end are the same, omit end property
    const isSingleDay = eventStartDate === eventEndDate;
    const eventData: CalendarEvent = !isSingleDay
      ? {
          id: selectedEvent ? selectedEvent.id : Date.now().toString(),
          title: eventTitle,
          start: eventStartDate,
          end: (() => {
            const endDate = new Date(eventEndDate);
            endDate.setDate(endDate.getDate() + 1);
            return endDate.toISOString().split("T")[0];
          })(),
          extendedProps: { calendar: eventLevel },
        }
      : {
          id: selectedEvent ? selectedEvent.id : Date.now().toString(),
          title: eventTitle,
          start: eventStartDate,
          extendedProps: { calendar: eventLevel },
        };

    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? eventData : event
        )
      );
    } else {
      // Add new event
      setEvents((prevEvents) => [...prevEvents, eventData]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("Primary");
    setSelectedEvent(null);
  };

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
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: openModal,
            },
          }}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={closeModal}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
            <DialogDescription>
              Plan your next big moment: schedule or edit an event to stay on
              track
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="event-title">Event title</Label>
              <Input
                id="event-title"
                name="event-title"
                onChange={(e) => setEventTitle(e.target.value)}
                value={eventTitle}
                type="text"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="event-color">Event Color</Label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div
                      className={`form-check form-check-${value} form-check-inline`}
                    >
                      <label
                        className={`flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400 ${
                          eventLevel === key ? "font-bold" : ""
                        }`}
                        htmlFor={`modal${key}`}
                      >
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-level"
                            value={key}
                            id={`modal${key}`}
                            checked={eventLevel === key}
                            onChange={() => setEventLevel(key)}
                            aria-checked={eventLevel === key}
                          />
                          <span
                            className={`flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700 ${
                              eventLevel === key ? "bg-blue-500" : "bg-white"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                eventLevel === key
                                  ? "bg-blue-700 block"
                                  : "hidden"
                              }`}
                            ></span>
                          </span>
                        </span>
                        {key}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="event-start-date">Event Start Date</Label>
              <Input
                id="event-start-date"
                name="event-start-date"
                onChange={(e) => setEventStartDate(e.target.value)}
                value={eventStartDate}
                type="date"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="event-end-date">Event End Date</Label>
              <Input
                id="event-end-date"
                name="event-end-date"
                onChange={(e) => setEventEndDate(e.target.value)}
                value={eventEndDate}
                type="date"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleAddOrUpdateEvent}>
              {selectedEvent ? "Update Changes" : "Add Event"}
            </Button>
          </DialogFooter>
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

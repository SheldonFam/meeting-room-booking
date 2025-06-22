"use client";

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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  const pad = (n: number) => n.toString().padStart(2, "0");
  const toLocalDateString = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
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
    setEventStartDate(
      event.start ? toLocalDateString(new Date(event.start)) : ""
    );
    setEventEndDate(
      event.end
        ? (() => {
            const end = new Date(event.end);
            end.setDate(end.getDate() - 1);
            return toLocalDateString(end);
          })()
        : event.start
        ? toLocalDateString(new Date(event.start))
        : ""
    );
    setEventLevel(
      event.extendedProps && event.extendedProps.calendar
        ? event.extendedProps.calendar
        : "Primary"
    );
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (!eventTitle || !eventStartDate || !eventLevel) {
      alert("Please fill in all fields and select an event color.");
      return;
    }
    // Best practice: if start and end are the same, or end is empty, omit end property
    const isSingleDay = !eventEndDate || eventStartDate === eventEndDate;
    const eventData: CalendarEvent = !isSingleDay
      ? {
          id: selectedEvent ? selectedEvent.id : Date.now().toString(),
          title: eventTitle,
          start: eventStartDate,
          end: (() => {
            const endDate = new Date(eventEndDate);
            endDate.setDate(endDate.getDate() + 1);
            return toLocalDateString(endDate);
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
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? eventData : event
        )
      );
    } else {
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
        <DialogContent className="sm:max-w-[425px] p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-1">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Plan your next big moment: schedule or edit an event to stay on
              track
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="event-title">Event title</Label>
              <Input
                id="event-title"
                name="event-title"
                onChange={(e) => setEventTitle(e.target.value)}
                value={eventTitle}
                type="text"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-color">Event Color</Label>
              <RadioGroup
                id="event-color"
                value={eventLevel}
                onValueChange={setEventLevel}
                className="flex flex-row items-center gap-2 flex-wrap"
              >
                {Object.keys(calendarsEvents).map((key) => (
                  <span key={key} className="flex items-center gap-1 mr-3">
                    <RadioGroupItem value={key} id={`modal${key}`} />
                    <Label
                      htmlFor={`modal${key}`}
                      className={
                        eventLevel === key
                          ? "font-bold text-sm text-gray-700 dark:text-gray-400"
                          : "text-sm text-gray-700 dark:text-gray-400"
                      }
                    >
                      {key}
                    </Label>
                  </span>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <DatePicker
                label="Event Start Date"
                value={parseLocalDate(eventStartDate)}
                onChange={(date) =>
                  setEventStartDate(date ? toLocalDateString(date) : "")
                }
                id="event-start-date"
              />
            </div>
            <div className="grid gap-2">
              <DatePicker
                label="Event End Date"
                value={parseLocalDate(eventEndDate)}
                onChange={(date) =>
                  setEventEndDate(date ? toLocalDateString(date) : "")
                }
                id="event-end-date"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={closeModal}
                className="min-w-[90px]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleAddOrUpdateEvent}
              className="min-w-[120px]"
            >
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

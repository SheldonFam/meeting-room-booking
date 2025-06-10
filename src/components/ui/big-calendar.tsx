"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  description?: string;
}

interface CalendarProps {
  events?: Event[];
  onEventClick?: (event: Event) => void;
  onAddEvent?: () => void;
  className?: string;
}

export function BigCalendar({
  events = [],
  onEventClick,
  onAddEvent,
  className,
}: CalendarProps) {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "year">("week");

  // Effect to scroll to the current time in week view
  useEffect(() => {
    if (
      view === "week" &&
      container.current &&
      containerNav.current &&
      containerOffset.current
    ) {
      const currentMinute = new Date().getHours() * 60;
      container.current.scrollTop =
        ((container.current.scrollHeight -
          containerNav.current.offsetHeight -
          containerOffset.current.offsetHeight) *
          currentMinute) /
        1440;
    }
  }, [view]); // Re-run when view changes

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getWeeksInMonth = (date: Date) => {
    const firstDay = getFirstDayOfMonth(date);
    const daysInMonth = getDaysInMonth(date);
    return Math.ceil((daysInMonth + firstDay) / 7);
  };

  const getMonthDays = (date: Date) => {
    const days = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(date);
    const firstDayIndex = getFirstDayOfMonth(date);

    // Add padding days from the previous month
    const lastDayOfPreviousMonth = new Date(year, month, 0);
    for (let i = firstDayIndex; i > 0; i--) {
      days.push(
        new Date(
          lastDayOfPreviousMonth.setDate(lastDayOfPreviousMonth.getDate() - 1)
        )
      );
    }
    days.reverse(); // Reverse to get correct order

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Add padding days from the next month
    const totalCells = getWeeksInMonth(date) * 7;
    const remainingCells = totalCells - days.length;
    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        new Date(firstDayOfNextMonth.setDate(firstDayOfNextMonth.getDate() + 1))
      );
    }

    return days;
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameMonth = (date1: Date, date2: Date) => {
    return (
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (view === "year") {
      newDate.setFullYear(currentDate.getFullYear() - 1);
    } else if (view === "day") {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (view === "year") {
      newDate.setFullYear(currentDate.getFullYear() + 1);
    } else if (view === "day") {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const renderDayView = () => {
    const day = currentDate;
    const dayEvents = events.filter((event) => {
      const eventStartTime = new Date(event.startTime);
      return (
        eventStartTime.getDate() === day.getDate() &&
        eventStartTime.getMonth() === day.getMonth() &&
        eventStartTime.getFullYear() === day.getFullYear()
      );
    });

    return (
      <div
        ref={container}
        className="isolate flex flex-auto flex-col overflow-auto bg-white"
      >
        <div className="flex max-w-full flex-none flex-col md:max-w-full">
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow-sm ring-1 ring-black/5"
          >
            <div className="grid grid-cols-1 text-sm/6 text-gray-500">
              <div
                key={day.toISOString()}
                className="flex flex-col items-center py-3"
              >
                <span className="flex items-baseline">
                  {day.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Time slots */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {Array.from({ length: 24 }).map((_, hour) => (
                  <div key={hour}>
                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs/5 text-gray-400">
                      {formatTime(new Date(2000, 0, 1, hour))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{
                  gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
                }}
              >
                {dayEvents.map((event) => {
                  const startTime = new Date(event.startTime);
                  const endTime = new Date(event.endTime);
                  const startHour = startTime.getHours();
                  const startMinute = startTime.getMinutes();
                  const duration =
                    (endTime.getTime() - startTime.getTime()) / (1000 * 60);

                  return (
                    <li
                      key={event.id}
                      className="relative mt-px flex"
                      style={{
                        gridRow: `${
                          startHour * 12 + Math.floor(startMinute / 5) + 2
                        } / span ${Math.ceil(duration / 5)}`,
                      }}
                    >
                      <button
                        onClick={() => onEventClick?.(event)}
                        className={cn(
                          "group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs/5",
                          event.color === "blue"
                            ? "bg-blue-50 hover:bg-blue-100"
                            : event.color === "pink"
                            ? "bg-pink-50 hover:bg-pink-100"
                            : "bg-gray-100 hover:bg-gray-200"
                        )}
                      >
                        <p
                          className={cn(
                            "order-1 font-semibold",
                            event.color === "blue"
                              ? "text-blue-700"
                              : event.color === "pink"
                              ? "text-pink-700"
                              : "text-gray-700"
                          )}
                        >
                          {event.title}
                        </p>
                        <p
                          className={cn(
                            "group-hover:text-gray-700",
                            event.color === "blue"
                              ? "text-blue-500"
                              : event.color === "pink"
                              ? "text-pink-500"
                              : "text-gray-500"
                          )}
                        >
                          <time dateTime={event.startTime}>
                            {formatTime(startTime)}
                          </time>
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    return (
      <div
        ref={container}
        className="isolate flex flex-auto flex-col overflow-auto bg-white"
      >
        <div
          style={{ width: view === "week" ? "100%" : "165%" }}
          className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow-sm ring-1 ring-black/5 sm:pr-8"
          >
            <div className="grid grid-cols-7 text-sm/6 text-gray-500 sm:hidden">
              {weekDays.map((day) => (
                <button
                  key={day.toISOString()}
                  type="button"
                  className="flex flex-col items-center pt-2 pb-3"
                >
                  {day
                    .toLocaleDateString("en-US", { weekday: "short" })
                    .charAt(0)}{" "}
                  <span
                    className={cn(
                      "mt-1 flex size-8 items-center justify-center font-semibold",
                      isToday(day)
                        ? "rounded-full bg-indigo-600 text-white"
                        : "text-gray-900"
                    )}
                  >
                    {day.getDate()}
                  </span>
                </button>
              ))}
            </div>

            <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm/6 text-gray-500 sm:grid">
              <div className="col-end-1 w-14" />
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className="flex items-center justify-center py-3"
                >
                  <span className="flex items-baseline">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}{" "}
                    <span
                      className={cn(
                        "ml-1.5 flex size-8 items-center justify-center font-semibold",
                        isToday(day)
                          ? "rounded-full bg-indigo-600 text-white"
                          : "text-gray-900"
                      )}
                    >
                      {day.getDate()}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Time slots */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {Array.from({ length: 24 }).map((_, hour) => (
                  <div key={hour}>
                    <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs/5 text-gray-400">
                      {formatTime(new Date(2000, 0, 1, hour))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{
                  gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
                }}
              >
                {events.map((event) => {
                  const startTime = new Date(event.startTime);
                  const endTime = new Date(event.endTime);
                  const startHour = startTime.getHours();
                  const startMinute = startTime.getMinutes();
                  const duration =
                    (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                  const dayIndex = weekDays.findIndex(
                    (day) =>
                      day.getDate() === startTime.getDate() &&
                      day.getMonth() === startTime.getMonth() &&
                      day.getFullYear() === startTime.getFullYear()
                  );

                  if (dayIndex === -1) return null;

                  return (
                    <li
                      key={event.id}
                      className={`relative mt-px flex sm:col-start-${
                        dayIndex + 1
                      }`}
                      style={{
                        gridRow: `${
                          startHour * 12 + Math.floor(startMinute / 5) + 2
                        } / span ${Math.ceil(duration / 5)}`,
                      }}
                    >
                      <button
                        onClick={() => onEventClick?.(event)}
                        className={cn(
                          "group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs/5",
                          event.color === "blue"
                            ? "bg-blue-50 hover:bg-blue-100"
                            : event.color === "pink"
                            ? "bg-pink-50 hover:bg-pink-100"
                            : "bg-gray-100 hover:bg-gray-200"
                        )}
                      >
                        <p
                          className={cn(
                            "order-1 font-semibold",
                            event.color === "blue"
                              ? "text-blue-700"
                              : event.color === "pink"
                              ? "text-pink-700"
                              : "text-gray-700"
                          )}
                        >
                          {event.title}
                        </p>
                        <p
                          className={cn(
                            "group-hover:text-gray-700",
                            event.color === "blue"
                              ? "text-blue-500"
                              : event.color === "pink"
                              ? "text-pink-500"
                              : "text-gray-500"
                          )}
                        >
                          <time dateTime={event.startTime}>
                            {formatTime(startTime)}
                          </time>
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getMonthDays(currentDate);
    const startingDay = getFirstDayOfMonth(currentDate);
    const weeksInMonth = getWeeksInMonth(currentDate);

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-7 text-center text-xs font-semibold leading-6 text-gray-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div
          className={`grid grid-cols-7 grid-rows-${weeksInMonth} text-sm h-full`}
        >
          {days.map((day, dayIdx) => (
            <div
              key={day.toISOString()}
              className={cn(
                dayIdx > startingDay && !isSameMonth(day, currentDate)
                  ? "text-gray-400"
                  : "",
                "relative py-2 px-3 border-r border-b border-gray-200"
              )}
            >
              <time
                dateTime={day.toISOString()}
                className={cn(
                  "ml-auto flex h-6 w-6 items-center justify-center rounded-full",
                  isToday(day)
                    ? "bg-indigo-600 font-semibold text-white"
                    : undefined,
                  !isToday(day) &&
                    isSameMonth(day, currentDate) &&
                    dayIdx % 7 !== 0 &&
                    dayIdx % 7 !== 6
                    ? "text-gray-900"
                    : undefined,
                  !isToday(day) &&
                    !isSameMonth(day, currentDate) &&
                    dayIdx % 7 !== 0 &&
                    dayIdx % 7 !== 6
                    ? "text-gray-400"
                    : undefined,
                  dayIdx % 7 === 0 || dayIdx % 7 === 6
                    ? isToday(day)
                      ? "text-white"
                      : isSameMonth(day, currentDate)
                      ? "text-blue-600"
                      : "text-gray-400"
                    : undefined
                )}
              >
                {day.getDate()}
              </time>
              {/* Event placeholders for month view */}
              {/* You would typically iterate through events here and display indicators */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }).map(
      (_, i) => new Date(year, i, 1)
    );

    return (
      <div className="grid grid-cols-3 gap-8 py-8">
        {months.map((month) => (
          <div key={month.toISOString()} className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {month.toLocaleDateString("en-US", { month: "long" })}
            </h3>
            {/* You would typically render a mini-month calendar here */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-base font-semibold text-gray-900">
          <time dateTime={currentDate.toISOString()}>
            {view === "year"
              ? currentDate.toLocaleDateString("en-US", { year: "numeric" })
              : view === "month"
              ? currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-xs md:items-stretch">
            <button
              type="button"
              onClick={handlePrevious}
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous {view}</span>
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              onClick={handleNext}
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next {view}</span>
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <MenuButton
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
              >
                {view.charAt(0).toUpperCase() + view.slice(1)} view
                <ChevronDownIcon
                  className="-mr-1 size-5 text-gray-400"
                  aria-hidden="true"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  {(["day", "week", "month", "year"] as const).map(
                    (viewOption) => (
                      <MenuItem key={viewOption}>
                        <button
                          onClick={() => setView(viewOption)}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {viewOption.charAt(0).toUpperCase() +
                            viewOption.slice(1)}{" "}
                          view
                        </button>
                      </MenuItem>
                    )
                  )}
                </div>
              </MenuItems>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              onClick={onAddEvent}
              className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="size-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Create event
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Go to today
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <button
                    onClick={() => setView("day")}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Day view
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => setView("week")}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Week view
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => setView("month")}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Month view
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => setView("year")}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Year view
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>
      {view === "day" && renderDayView()}
      {view === "week" && renderWeekView()}
      {view === "month" && renderMonthView()}
      {view === "year" && renderYearView()}
    </div>
  );
}

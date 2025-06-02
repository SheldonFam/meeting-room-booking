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

export function Calendar({
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

  useEffect(() => {
    if (container.current && containerNav.current && containerOffset.current) {
      const currentMinute = new Date().getHours() * 60;
      container.current.scrollTop =
        ((container.current.scrollHeight -
          containerNav.current.offsetHeight -
          containerOffset.current.offsetHeight) *
          currentMinute) /
        1440;
    }
  }, []);

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

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

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = getWeekDays();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-base font-semibold text-gray-900">
          <time dateTime={currentDate.toISOString()}>
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-xs md:items-stretch">
            <button
              type="button"
              onClick={handlePreviousWeek}
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous week</span>
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
              onClick={handleNextWeek}
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next week</span>
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
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <div
        ref={container}
        className="isolate flex flex-auto flex-col overflow-auto bg-white"
      >
        <div
          style={{ width: "165%" }}
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
                      className="relative mt-px flex sm:col-start-{dayIndex + 1}"
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
    </div>
  );
}

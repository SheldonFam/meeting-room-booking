import React from "react";
import { useForm, Controller } from "react-hook-form";
import { BookingFormFields, BookingFormProps } from "@/types/models";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utility functions
const pad = (n: number) => n.toString().padStart(2, "0");
const toLocalDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const BookingForm: React.FC<BookingFormProps> = ({
  initialValues = {},
  onSubmit,
  maxAttendees = 20,
  submitLabel = "Book Room",
  loading = false,
  rooms = [],
  hideRoomSelect = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormFields>({
    defaultValues: {
      title: initialValues.title || "",
      description: initialValues.description || "",
      startDate: initialValues.startDate
        ? new Date(initialValues.startDate)
        : undefined,
      endDate: initialValues.endDate
        ? new Date(initialValues.endDate)
        : undefined,
      startTime: initialValues.startTime || "",
      endTime: initialValues.endTime || "",
      attendees: initialValues.attendees ? Number(initialValues.attendees) : 1,
      color: initialValues.color || "Primary",
      roomId: initialValues.roomId ? String(initialValues.roomId) : "",
    },
    mode: "onBlur",
  });

  // 12-hour format time slots with AM/PM
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ];

  // Helper function to convert 12-hour format to 24-hour format for API
  const convertTo24Hour = (time12h: string) => {
    const [time, period] = time12h.split(" ");
    const [hour, minute] = time.split(":").map(Number);

    let hour24 = hour;
    if (period === "PM" && hour !== 12) {
      hour24 = hour + 12;
    } else if (period === "AM" && hour === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const onFormSubmit = ({
    title,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    attendees,
    color,
    roomId,
  }: BookingFormFields) => {
    if (!startDate || !endDate) return;
    // If hideRoomSelect, use the first room in the array
    const selectedRoomId =
      hideRoomSelect && rooms.length > 0 ? String(rooms[0].id) : roomId;

    onSubmit({
      title,
      description,
      startDate: toLocalDateString(startDate),
      endDate: toLocalDateString(endDate),
      startTime: convertTo24Hour(startTime), // Convert to 24-hour format
      endTime: convertTo24Hour(endTime), // Convert to 24-hour format
      attendees,
      color,
      roomId: selectedRoomId, // always send the correct roomId
      // location: selectedRoom ? selectedRoom.location : "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="bg-white dark:bg-gray-900 rounded-lg space-y-6 flex flex-col gap-2"
    >
      <fieldset disabled={loading} className="contents">
        {/* Room selection dropdown or read-only */}
        {!hideRoomSelect && (
          <div>
            <Label htmlFor="roomId">Room</Label>
            <Controller
              name="roomId"
              control={control}
              rules={{ required: "Room is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms && rooms.length > 0 ? (
                      rooms.map((room) => (
                        <SelectItem
                          key={room.id}
                          value={String(room.id)}
                          className="w-full"
                        >
                          {room.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="" className="w-full">
                        No rooms available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roomId && (
              <span className="text-red-500 text-xs">
                {errors.roomId.message}
              </span>
            )}
          </div>
        )}
        <div>
          <Label htmlFor="title">Meeting Title</Label>
          <Input
            id="title"
            autoComplete="off"
            className="w-full"
            {...register("title", { required: "Title is required" })}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            autoComplete="off"
            className="w-full"
            {...register("description", {
              required: "Description is required",
            })}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <span className="text-red-500 text-xs">
              {errors.description.message}
            </span>
          )}
        </div>
        {/* Date and Time Grouped */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: "Start date is required" }}
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  value={field.value}
                  onChange={field.onChange}
                  id="start-date"
                />
              )}
            />
            {errors.startDate && (
              <span className="text-red-500 text-xs">
                {errors.startDate.message}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Controller
              name="startTime"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot} className="w-full">
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.startTime && (
              <span className="text-red-500 text-xs">
                {errors.startTime.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Controller
              name="endDate"
              control={control}
              rules={{ required: "End date is required" }}
              render={({ field }) => (
                <DatePicker
                  label="End Date"
                  value={field.value}
                  onChange={field.onChange}
                  id="end-date"
                />
              )}
            />
            {errors.endDate && (
              <span className="text-red-500 text-xs">
                {errors.endDate.message}
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="end-time">End Time</Label>
            <Controller
              name="endTime"
              control={control}
              rules={{ required: "End time is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot} className="w-full">
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.endTime && (
              <span className="text-red-500 text-xs">
                {errors.endTime.message}
              </span>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="attendees">Number of Attendees</Label>
          <Input
            id="attendees"
            type="number"
            min="1"
            max={maxAttendees}
            autoComplete="off"
            className="w-full"
            {...register("attendees", {
              required: "Number of attendees is required",
              min: { value: 1, message: "At least 1 attendee required" },
              max: {
                value: maxAttendees,
                message: `No more than ${maxAttendees} attendees`,
              },
              valueAsNumber: true,
            })}
            aria-invalid={!!errors.attendees}
          />
          {errors.attendees && (
            <span className="text-red-500 text-xs">
              {errors.attendees.message}
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="color">Event Color</Label>
          <Controller
            name="color"
            control={control}
            rules={{ required: "Color is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary" className="w-full">
                    Primary
                  </SelectItem>
                  <SelectItem value="Success" className="w-full">
                    Success
                  </SelectItem>
                  <SelectItem value="Danger" className="w-full">
                    Danger
                  </SelectItem>
                  <SelectItem value="Warning" className="w-full">
                    Warning
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.color && (
            <span className="text-red-500 text-xs">{errors.color.message}</span>
          )}
        </div>
        <Button
          type="submit"
          className="w-full mt-6"
          disabled={loading}
          loading={loading}
        >
          {submitLabel}
        </Button>
      </fieldset>
    </form>
  );
};

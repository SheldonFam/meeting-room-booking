import React from "react";
import { useForm, Controller } from "react-hook-form";
import { BookingEvent } from "@/types/booking-event";
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

interface BookingFormProps {
  initialValues?: Partial<BookingEvent>;
  onSubmit: (data: Omit<BookingEvent, "id" | "roomId">) => void;
  maxAttendees?: number;
  submitLabel?: string;
}

// Utility functions
const pad = (n: number) => n.toString().padStart(2, "0");
const toLocalDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

type BookingFormFields = {
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  attendees: string;
  color: string;
};

export const BookingForm: React.FC<BookingFormProps> = ({
  initialValues = {},
  onSubmit,
  maxAttendees = 20,
  submitLabel = "Book Room",
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
      attendees: initialValues.attendees?.toString() || "",
      color: initialValues.color || "Primary",
    },
  });

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const onFormSubmit = ({
    title,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    attendees,
    color,
  }: BookingFormFields) => {
    if (!startDate || !endDate) return;
    onSubmit({
      title,
      description,
      startDate: toLocalDateString(startDate),
      endDate: toLocalDateString(endDate),
      startTime,
      endTime,
      attendees: Number(attendees),
      color,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Meeting Title</Label>
        <Input id="title" {...register("title", { required: true })} />
        {errors.title && (
          <span className="text-red-500 text-xs">Title is required</span>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <span className="text-red-500 text-xs">Description is required</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Controller
            name="startDate"
            control={control}
            rules={{ required: true }}
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
            <span className="text-red-500 text-xs">Start date is required</span>
          )}
        </div>
        <div>
          <Controller
            name="endDate"
            control={control}
            rules={{ required: true }}
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
            <span className="text-red-500 text-xs">End date is required</span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-time">Start Time</Label>
          <Controller
            name="startTime"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.startTime && (
            <span className="text-red-500 text-xs">Start time is required</span>
          )}
        </div>
        <div>
          <Label htmlFor="end-time">End Time</Label>
          <Controller
            name="endTime"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.endTime && (
            <span className="text-red-500 text-xs">End time is required</span>
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
          {...register("attendees", {
            required: true,
            min: 1,
            max: maxAttendees,
          })}
        />
        {errors.attendees && (
          <span className="text-red-500 text-xs">
            Attendees must be between 1 and {maxAttendees}
          </span>
        )}
      </div>
      <div>
        <Label htmlFor="color">Event Color</Label>
        <Controller
          name="color"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary">Primary</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Danger">Danger</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.color && (
          <span className="text-red-500 text-xs">Color is required</span>
        )}
      </div>
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
};

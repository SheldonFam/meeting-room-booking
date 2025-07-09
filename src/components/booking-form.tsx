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
  loading?: boolean;
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
  attendees: number;
  color: string;
};

export const BookingForm: React.FC<BookingFormProps> = ({
  initialValues = {},
  onSubmit,
  maxAttendees = 20,
  submitLabel = "Book Room",
  loading = false,
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
    },
    mode: "onBlur",
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
      attendees,
      color,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <fieldset disabled={loading} className="contents">
        <div>
          <Label htmlFor="title">Meeting Title</Label>
          <Input
            id="title"
            autoComplete="off"
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
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Controller
              name="startTime"
              control={control}
              rules={{ required: "Start time is required" }}
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
              <span className="text-red-500 text-xs">
                {errors.startTime.message}
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
            <span className="text-red-500 text-xs">{errors.color.message}</span>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          loading={loading}
        >
          {submitLabel}
        </Button>
      </fieldset>
    </form>
  );
};

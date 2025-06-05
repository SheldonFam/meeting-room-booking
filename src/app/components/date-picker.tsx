"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function CustomDatePicker({
  selected,
  onChange,
  placeholderText = "Select date",
  className = "",
  minDate,
  maxDate,
}: CustomDatePickerProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      placeholderText={placeholderText}
      dateFormat="MMMM d, yyyy"
      minDate={minDate}
      maxDate={maxDate}
      showPopperArrow={false}
    />
  );
}

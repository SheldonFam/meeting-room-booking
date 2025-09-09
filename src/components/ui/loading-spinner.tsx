"use-client";

import React from "react";

interface LoadingSpinnerProps {
  show?: boolean;
  size?: string;
  color?: string;
  backDropClass?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  show = false,
  size = "h-16 w-16",
  color = "border-t-blue-500",
  backDropClass = "bg-white/70 dark:bg-gray-900/70",
}) => {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center ${backDropClass}`}
    >
      <div
        className={`animate-spin ease-linear rounded-full border-8 border-gray-200 ${color} ${size}`}
      ></div>
    </div>
  );
};

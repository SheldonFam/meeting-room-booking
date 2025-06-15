"use client";

import { cn } from "@/lib/utils";

interface SmallCardProps {
  icon: React.ReactNode; // can be image path or icon URL
  title: string;
  description: string | number;
  className?: string;
  iconBg?: string; // optional background color for the icon
  iconColor?: string; // optional text color for the icon
}

export function SmallCard({
  icon,
  title,
  description,
  className,
  iconBg,
  iconColor,
}: SmallCardProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center gap-4 p-4 rounded-lg shadow-sm border-gray-200 bg-white dark:bg-gray-800",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-white">
          {title}
        </h4>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          {description}
        </p>
      </div>
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full",
          iconBg,
          iconColor
        )}
      >
        {icon}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface SmallCardProps {
  iconUrl: string; // can be image path or icon URL
  title: string;
  description: string | number;
  className?: string;
}

export function SmallCard({
  iconUrl,
  title,
  description,
  className,
}: SmallCardProps) {
  return (
    <div
      className={cn(
        "flex items-center flex-row gap-4 p-4 rounded-lg shadow-sm border-gray-200 bg-white dark:bg-gray-800",
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
      <div className="relative w-10 h-10">
        <Image src={iconUrl} alt={title} fill className="object-contain" />
      </div>
    </div>
  );
}

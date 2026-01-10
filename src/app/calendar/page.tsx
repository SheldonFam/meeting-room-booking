import { BigCalendar } from "@/components/ui/big-calendar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Meeting Room Calendar
        </h1>
        <BigCalendar />
      </div>
    </div>
  );
}

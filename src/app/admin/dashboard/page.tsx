"use client";

import { Card } from "@/components/ui/card";
// You can replace this with a real chart library later

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Room Usage Analytics</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">
            [Chart Placeholder]
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Booking Trends</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">
            [Chart Placeholder]
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { SmallCard } from "@/components/ui/small-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Mock data for charts and analytics
const roomUsageData = [
  { name: "Conference Room A", bookings: 45, utilization: 78 },
  { name: "Meeting Room B", bookings: 32, utilization: 65 },
  { name: "Board Room", bookings: 28, utilization: 58 },
  { name: "Training Room", bookings: 41, utilization: 72 },
  { name: "Small Meeting", bookings: 23, utilization: 45 },
  { name: "Video Conf", bookings: 19, utilization: 38 },
];

const bookingTrendsData = [
  { month: "Jan", bookings: 120, revenue: 2400 },
  { month: "Feb", bookings: 145, revenue: 2900 },
  { month: "Mar", bookings: 132, revenue: 2640 },
  { month: "Apr", bookings: 168, revenue: 3360 },
  { month: "May", bookings: 189, revenue: 3780 },
  { month: "Jun", bookings: 201, revenue: 4020 },
  { month: "Jul", bookings: 178, revenue: 3560 },
  { month: "Aug", bookings: 195, revenue: 3900 },
  { month: "Sep", bookings: 210, revenue: 4200 },
  { month: "Oct", bookings: 225, revenue: 4500 },
  { month: "Nov", bookings: 198, revenue: 3960 },
  { month: "Dec", bookings: 234, revenue: 4680 },
];

const statusDistribution = [
  { name: "Confirmed", value: 65, color: "#10b981" },
  { name: "Pending", value: 20, color: "#f59e0b" },
  { name: "Cancelled", value: 15, color: "#ef4444" },
];

const peakHoursData = [
  { hour: "9 AM", bookings: 12 },
  { hour: "10 AM", bookings: 18 },
  { hour: "11 AM", bookings: 15 },
  { hour: "12 PM", bookings: 8 },
  { hour: "1 PM", bookings: 6 },
  { hour: "2 PM", bookings: 14 },
  { hour: "3 PM", bookings: 16 },
  { hour: "4 PM", bookings: 13 },
  { hour: "5 PM", bookings: 9 },
];

// Key metrics
const adminStats = [
  {
    icon: <Users />,
    title: "Total Users",
    value: "1,247",
    change: "+12%",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    icon: <Calendar />,
    title: "Total Bookings",
    value: "2,156",
    change: "+8%",
    iconBg: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-300",
  },
  {
    icon: <TrendingUp />,
    title: "Revenue",
    value: "$45,230",
    change: "+15%",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-300",
  },
  {
    icon: <Clock />,
    title: "Avg. Duration",
    value: "2.3h",
    change: "-5%",
    iconBg: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-300",
  },
];

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of booking analytics and room utilization
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, index) => (
          <SmallCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            description={`${stat.value} ${stat.change}`}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Room Usage Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Room Usage Analytics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Booking Trends Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Booking Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Booking Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Peak Hours */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Peak Booking Hours
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={peakHoursData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="hour" type="category" width={60} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Quick Actions
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Pending Approvals
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                12 bookings awaiting approval
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">
                Room Maintenance
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                2 rooms scheduled for maintenance
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h3 className="font-medium text-orange-900 dark:text-orange-100 mb-1">
                Overdue Bookings
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                3 bookings past end time
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";

const BookingChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const weeklyData = [
    { day: "Mon", bookings: 18 },
    { day: "Tue", bookings: 24 },
    { day: "Wed", bookings: 22 },
    { day: "Thu", bookings: 28 },
    { day: "Fri", bookings: 32 },
    { day: "Sat", bookings: 15 },
    { day: "Sun", bookings: 12 },
  ];

  const monthlyData = [
    { day: "Week 1", bookings: 98 },
    { day: "Week 2", bookings: 124 },
    { day: "Week 3", bookings: 142 },
    { day: "Week 4", bookings: 156 },
  ];

  const data = timeRange === "week" ? weeklyData : monthlyData;
  const maxBookings = Math.max(...data.map((d) => d.bookings));

  return (
    <ComponentCard title="Booking Statistics">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTimeRange("week")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeRange === "week"
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeRange("month")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeRange === "month"
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          This Month
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 h-64">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {item.bookings}
            </div>
            <div
              className="w-full bg-brand-100 rounded-t-lg dark:bg-brand-900/30"
              style={{ height: `${(item.bookings / maxBookings) * 200}px` }}
            >
              <div
                className="w-full bg-brand-500 rounded-t-lg transition-all duration-300 hover:bg-brand-600"
                style={{ height: "100%" }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.day}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, d) => sum + d.bookings, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Average</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {Math.round(data.reduce((sum, d) => sum + d.bookings, 0) / data.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Peak Day</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {data.find((d) => d.bookings === maxBookings)?.day}
          </p>
        </div>
      </div>
    </ComponentCard>
  );
};

export default BookingChart;

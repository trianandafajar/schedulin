"use client";
import React, { useState, useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { format, parseISO, getDay, startOfWeek, addDays, isSameWeek, isSameMonth } from "date-fns";

interface Booking {
  id: string;
  slot?: {
    date: string;
  } | null;
  created_at: string;
}

interface BookingChartProps {
  bookings: Booking[];
}

const BookingChart: React.FC<BookingChartProps> = ({ bookings }) => {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const data = useMemo(() => {
    if (timeRange === "week") {
      // Group by day of week (Mon-Sun)
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const counts = new Array(7).fill(0);
      
      bookings.forEach(booking => {
        if (!booking.slot?.date) return;
        const date = parseISO(booking.slot.date);
        const dayIndex = getDay(date); // 0 = Sunday, 1 = Monday
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert to Mon-Sun
        counts[adjustedIndex]++;
      });

      return days.map((day, idx) => ({ day, bookings: counts[idx] }));
    } else {
      // Group by week of month (Week 1-4)
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const counts = new Array(4).fill(0);
      const now = new Date();
      
      bookings.forEach(booking => {
        if (!booking.slot?.date) return;
        const date = parseISO(booking.slot.date);
        if (!isSameMonth(date, now)) return;
        
        const weekStart = startOfWeek(now);
        const bookingStart = startOfWeek(date);
        const diffWeeks = Math.floor((bookingStart.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
        
        if (diffWeeks >= 0 && diffWeeks < 4) {
          counts[diffWeeks]++;
        }
      });

      return weeks.map((day, idx) => ({ day, bookings: counts[idx] }));
    }
  }, [bookings, timeRange]);

  const maxBookings = Math.max(...data.map((d) => d.bookings), 1);

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
            {data.find((d) => d.bookings === maxBookings)?.day || "-"}
          </p>
        </div>
      </div>
    </ComponentCard>
  );
};

export default BookingChart;
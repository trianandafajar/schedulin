"use client";
import React, { useState, useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { parseISO, getDay, startOfWeek, isSameMonth } from "date-fns";

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
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const counts = new Array(7).fill(0);
      
      bookings.forEach(booking => {
        if (!booking.slot?.date) return;
        const date = parseISO(booking.slot.date);
        const dayIndex = getDay(date); 
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; 
        counts[adjustedIndex]++;
      });

      return days.map((day, idx) => ({ label: day, value: counts[idx] }));
    } else {
      const weeks = ["W1", "W2", "W3", "W4"];
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

      return weeks.map((week, idx) => ({ label: week, value: counts[idx] }));
    }
  }, [bookings, timeRange]);

  const maxBookings = Math.max(...data.map((d) => d.value), 1);
  const totalBookings = data.reduce((sum, d) => sum + d.value, 0);
  const avgBookings = Math.round(totalBookings / data.length);
  const peakDay = data.reduce((prev, current) => (prev.value > current.value) ? prev : current).label;

  return (
    <ComponentCard title="Booking Analytics">
      <div className="mb-8 flex">
        <div className="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setTimeRange("week")}
            className={`rounded-md px-5 py-2 text-sm font-medium transition-all duration-200 ${
              timeRange === "week"
                ? "bg-white text-gray-900 shadow-sm dark:bg-[#212121] dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`rounded-md px-5 py-2 text-sm font-medium transition-all duration-200 ${
              timeRange === "month"
                ? "bg-white text-gray-900 shadow-sm dark:bg-[#212121] dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="mt-8 flex h-64 items-end justify-between gap-2 sm:gap-4">
        {data.map((item, index) => {
          const heightPercentage = item.value === 0 ? 0 : Math.max((item.value / maxBookings) * 100, 1);
          
          return (
            <div key={index} className="group/bar relative flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="absolute top-0 z-10 scale-0 rounded-md bg-gray-900 px-2.5 py-1 text-xs font-bold text-white opacity-0 transition-all duration-200 group-hover/bar:scale-100 group-hover/bar:opacity-100 dark:bg-white dark:text-gray-900">
                {item.value}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900 dark:bg-white"></div>
              </div>

              <div className="relative h-48 w-full max-w-[3rem] rounded-t-lg bg-gray-100 dark:bg-gray-800">
                <div
                  className="absolute bottom-0 w-full rounded-t-lg bg-blue-800 transition-all duration-500 group-hover/bar:bg-blue-400 group-hover/bar:opacity-100 dark:bg-blue-800"
                  style={{ height: `${heightPercentage}%` }}
                />
              </div>

              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-[#151515]">
        <div className="flex flex-col items-center border-r border-gray-200 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{totalBookings}</p>
        </div>
        <div className="flex flex-col items-center border-r border-gray-200 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Average</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{avgBookings}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Peak Period</p>
          <p className="mt-1 text-2xl font-bold text-blue-800">{peakDay || "-"}</p>
        </div>
      </div>
    </ComponentCard>
  );
};

export default BookingChart;
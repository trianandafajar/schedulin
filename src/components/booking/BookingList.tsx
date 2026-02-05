"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

interface Booking {
  id: string;
  customerName: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "cancelled";
}

const bookings: Booking[] = [
  { id: "BK001", customerName: "John Smith", date: "Today", time: "09:00 AM", status: "completed" },
  { id: "BK002", customerName: "Sarah Johnson", date: "Today", time: "10:30 AM", status: "pending" },
  { id: "BK003", customerName: "Mike Wilson", date: "Today", time: "11:00 AM", status: "completed" },
  { id: "BK004", customerName: "Emily Davis", date: "Today", time: "02:00 PM", status: "pending" },
  { id: "BK005", customerName: "Robert Brown", date: "Today", time: "03:30 PM", status: "cancelled" },
  { id: "BK006", customerName: "Lisa Anderson", date: "Yesterday", time: "10:00 AM", status: "completed" },
  { id: "BK007", customerName: "David Lee", date: "Yesterday", time: "11:30 AM", status: "completed" },
  { id: "BK008", customerName: "Jennifer Taylor", date: "Yesterday", time: "02:00 PM", status: "completed" },
];

const BookingList: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "today" | "yesterday">("all");

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "today") return booking.date === "Today";
    if (filter === "yesterday") return booking.date === "Yesterday";
    return true;
  });

  const getStatusStyles = (status: Booking["status"]) => {
    const styles: Record<string, { bg: string; text: string }> = {
      completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
      pending: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400" },
      cancelled: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
    };
    const labels: Record<string, string> = {
      completed: "Completed",
      pending: "Pending",
      cancelled: "Cancelled",
    };
    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${styles[status].bg} ${styles[status].text}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <ComponentCard title="Recent Bookings">
      <div className="flex gap-2 mb-6 text-left">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("today")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "today"
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilter("yesterday")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "yesterday"
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          Yesterday
        </button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Booking ID
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Customer
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Date & Time
              </TableCell>
              <TableCell isHeader className="py-3 font-semibold text-left text-gray-600 dark:text-gray-300">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow
                key={booking.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <TableCell className="py-4 text-gray-900 dark:text-white font-medium">
                  {booking.id}
                </TableCell>
                <TableCell className="py-4 text-gray-600 dark:text-gray-400">
                  {booking.customerName}
                </TableCell>
                <TableCell className="py-4 text-gray-600 dark:text-gray-400">
                  <div>
                    <div className="font-medium">{booking.date}</div>
                    <div className="text-sm text-gray-400">{booking.time}</div>
                  </div>
                </TableCell>
                <TableCell className="py-4">{getStatusStyles(booking.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No bookings found for the selected filter.
        </div>
      )}
    </ComponentCard>
  );
};

export default BookingList;

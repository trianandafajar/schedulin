"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { updateBookingStatus, BookingStatus } from "@/actions/booking";
import { Check, X, Loader2, CalendarX2 } from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "cancelled" | "confirmed";
  rawId?: string;
}

interface BookingListProps {
  bookings?: Booking[];
}

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  const [filter, setFilter] = useState<"all" | "today" | "yesterday">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredBookings = bookings!.filter((booking) => {
    if (filter === "today") return booking.date === "Today";
    if (filter === "yesterday") return booking.date === "Yesterday";
    return true;
  });

  const handleStatusChange = async (bookingId: string, rawId: string, status: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      const result = await updateBookingStatus(rawId, status);
      if (result.error) {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyles = (status: Booking["status"]) => {
    const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
      completed: { 
        bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20", 
        text: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
        label: "Completed" 
      },
      confirmed: { 
        bg: "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20", 
        text: "text-blue-700 dark:text-blue-400",
        dot: "bg-blue-500",
        label: "Confirmed" 
      },
      pending: { 
        bg: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20", 
        text: "text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
        label: "Pending" 
      },
      cancelled: { 
        bg: "bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20", 
        text: "text-rose-700 dark:text-rose-400",
        dot: "bg-rose-500",
        label: "Cancelled" 
      },
    };

    const currentStatus = status && config[status] ? status : 'pending';
    const style = config[currentStatus];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${style.bg} ${style.text}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        {style.label}
      </span>
    );
  };

  return (
    <ComponentCard title="Recent Bookings">
      <div className="mb-6 flex">
        <div className="inline-flex items-center rounded-xl bg-gray-100/80 p-1.5 dark:bg-[#151515]">
          {(["all", "today", "yesterday"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative px-5 py-2 text-sm font-semibold tracking-wide capitalize transition-all duration-300 rounded-lg ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm dark:bg-[#222] dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111111]">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-gray-50/50 dark:bg-[#151515]/50 border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  ID
                </TableCell>
                <TableCell isHeader className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Customer
                </TableCell>
                <TableCell isHeader className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date & Time
                </TableCell>
                <TableCell isHeader className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right text-gray-500 dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {filteredBookings.map((booking) => (
                <TableRow
                  key={booking.rawId || booking.id}
                  className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-[#151515]/50"
                >
                  <TableCell className="py-4 px-6 text-center">
                    <span className="font-mono text-xs font-medium text-gray-500 dark:text-gray-400">
                      {booking.id}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <span className="font-medium text-gray-900 dark:text-white text-center">
                      {booking.customerName}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-col text-center">
                      <span className="font-medium text-gray-900 dark:text-white ">{booking.date}</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{booking.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 flex justify-center">
                    {getStatusStyles(booking.status)}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
                      {(booking.status === "pending" || booking.status === "confirmed") && (
                        <>
                          <button
                            onClick={() => booking.rawId && handleStatusChange(booking.id, booking.rawId, "completed")}
                            disabled={updatingId === booking.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-transform hover:scale-110 hover:bg-emerald-100 disabled:opacity-50 disabled:hover:scale-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                            title="Complete"
                          >
                            {updatingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 stroke-[2.5]" />}
                          </button>
                          <button
                            onClick={() => booking.rawId && handleStatusChange(booking.id, booking.rawId, "cancelled")}
                            disabled={updatingId === booking.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-transform hover:scale-110 hover:bg-rose-100 disabled:opacity-50 disabled:hover:scale-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                            title="Cancel"
                          >
                            {updatingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 stroke-[2.5]" />}
                          </button>
                        </>
                      )}
                      
                      {booking.status === "completed" && (
                        <button
                          onClick={() => booking.rawId && handleStatusChange(booking.id, booking.rawId, "cancelled")}
                          disabled={updatingId === booking.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-transform hover:scale-110 hover:bg-rose-100 disabled:opacity-50 disabled:hover:scale-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                          title="Cancel"
                        >
                          {updatingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 stroke-[2.5]" />}
                        </button>
                      )}

                      {booking.status === "cancelled" && (
                        <button
                          onClick={() => booking.rawId && handleStatusChange(booking.id, booking.rawId, "pending")}
                          disabled={updatingId === booking.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-transform hover:scale-110 hover:bg-gray-200 disabled:opacity-50 disabled:hover:scale-100 dark:bg-[#222] dark:text-gray-400 dark:hover:bg-[#333]"
                          title="Restore"
                        >
                          {updatingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 stroke-[2.5]" />}
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-[#151515]">
              <CalendarX2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">No bookings found</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              There are no bookings matching the "{filter}" filter.
            </p>
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default BookingList;
import type { Metadata } from "next";
import React from "react";
import BookingMetrics from "@/components/booking/BookingMetrics";
import BookingChart from "@/components/booking/BookingChart";
import BookingList from "@/components/booking/BookingList";

export const metadata: Metadata = {
  title: "Dashboard | Schedulin - Appointment Scheduling",
  description: "Schedulin Dashboard - Manage your appointments and bookings",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <BookingMetrics />
      </div>

      <div className="col-span-12">
        <BookingChart />
      </div>

      <div className="col-span-12">
        <BookingList />
      </div>
    </div>
  );
}

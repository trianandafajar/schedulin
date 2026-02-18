import type { Metadata } from "next";
import BookingMetrics from "@/components/booking/BookingMetrics";
import BookingChart from "@/components/booking/BookingChart";
import BookingList from "@/components/booking/BookingList";
import { redirect } from "next/dist/server/api-utils";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Dashboard | Schedulin - Appointment Scheduling",
  description: "Schedulin Dashboard - Manage your appointments and bookings",
};

export default async function Dashboard() {
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

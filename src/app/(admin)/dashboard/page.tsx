import type { Metadata } from "next";
import BookingMetrics from "@/components/booking/BookingMetrics";
import BookingChart from "@/components/booking/BookingChart";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/actions/dashboard-actions";

export const metadata: Metadata = {
  title: "Dashboard | Schedulin - Appointment Scheduling",
  description: "Schedulin Dashboard - Manage your appointments and bookings",
};

export default async function Dashboard() {
  const result = await getDashboardData();

  if (result.redirect) {
    redirect(result.redirect);
  }

  if (result.error) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">{result.error}</p>
      </div>
    );
  }

  const bookingsData = result.bookings || [];

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <BookingMetrics bookings={bookingsData} />
      </div>

      <div className="col-span-12">
        <BookingChart bookings={bookingsData} />
      </div>
    </div>
  );
}

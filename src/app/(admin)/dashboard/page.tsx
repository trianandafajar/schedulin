import type { Metadata } from "next";
import BookingMetrics from "@/components/booking/BookingMetrics";
import BookingChart from "@/components/booking/BookingChart";
import BookingList from "@/components/booking/BookingList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import supabase from "@/actions/supabase";

export const metadata: Metadata = {
  title: "Dashboard | Schedulin - Appointment Scheduling",
  description: "Schedulin Dashboard - Manage your appointments and bookings",
};

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { data: business } = await supabase
    .from("business")
    .select("id")
    .eq("owner_id", userId)
    .single();

  if (!business) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No business found. Please create one first.</p>
      </div>
    );
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      status,
      customer_name,
      created_at,
      service:services(name),
      slot:appointment_slots(date, time)
    `)
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const bookingsData = bookings || [];

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
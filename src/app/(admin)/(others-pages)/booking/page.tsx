import supabase from "@/actions/supabase";
import BookingList from "@/components/booking/BookingList";
import { auth } from "@clerk/nextjs/server";

const BookingPage: React.FC = async () => {
  const { userId } = await auth();

  const { data: business } = await supabase
    .from("business")
    .select("id")
    .eq("owner_id", userId)
    .single();

  const { data: bookingsData } = await supabase
    .from("bookings")
    .select(`
      id,
      customer_name,
      status,
      slot:appointment_slots(date, time)
    `)
    .eq("business_id", business?.id || "")
    .order("created_at", { ascending: false });

  const formattedBookings = bookingsData?.map(booking => {
    const dateObj = booking.slot?.date ? new Date(booking.slot.date) : null;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateLabel = "N/A";
    if (dateObj) {
      if (dateObj.toDateString() === today.toDateString()) dateLabel = "Today";
      else if (dateObj.toDateString() === yesterday.toDateString()) dateLabel = "Yesterday";
      else dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    return {
      id: `BK${booking.id.slice(0, 6).toUpperCase()}`,
      rawId: booking.id,
      customerName: booking.customer_name,
      date: dateLabel,
      time: booking.slot?.time ? booking.slot.time.slice(0, 5) : "N/A",
      status: (booking.status as "completed" | "pending" | "cancelled") || "pending"
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Oders List
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your booking list
          </p>
        </div>
        <BookingList bookings={formattedBookings} />
      </div>
    </div>
  );
};

export default BookingPage;
"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import supabase from "@/lib/supabase";

function getLocalDateLabel(dateStr: string): string {
  if (!dateStr) return "N/A";

  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const nowWIB = new Date(Date.now() + WIB_OFFSET_MS);

  const toDateStr = (d: Date) => [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0"),
  ].join("-");

  const todayStr = toDateStr(nowWIB);

  const yesterdayWIB = new Date(nowWIB.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = toDateStr(yesterdayWIB);

  const slotDate = dateStr.slice(0, 10);

  if (slotDate === todayStr) return "Today";
  if (slotDate === yesterdayStr) return "Yesterday";

  const [year, month, day] = slotDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}


export type BookingStatus = "pending" | "completed" | "cancelled";

export interface CreateBookingData {
  businessId: string;
  serviceId?: string;
  slotId: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export async function createBooking(data: CreateBookingData) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!userData) {
      return { error: "User not found" };
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        business_id: data.businessId,
        service_id: data.serviceId,
        slot_id: data.slotId,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        notes: data.notes,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Booking error:", error);
      return { error: error.message };
    }

    await supabase
      .from("appointment_slots")
      .update({ is_booked: true })
      .eq("id", data.slotId);

    revalidatePath("/booking");
    revalidatePath("/calendar");

    return { success: true, data: booking };
  } catch (error: any) {
    console.error("Create booking error:", error);
    return { error: error.message || "Failed to create booking" };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const { data: booking } = await supabase
      .from("bookings")
      .select("business_id, slot_id")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return { error: "Booking not found" };
    }

    const { data: business } = await supabase
      .from("business")
      .select("id")
      .eq("id", booking.business_id)
      .eq("owner_id", userId)
      .single();

    if (!business) {
      return { error: "Unauthorized - not your business" };
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", bookingId);

    if (error) {
      console.error("Update status error:", error);
      return { error: error.message };
    }

    // If cancelled, free up the slot
    if (status === "cancelled" && booking.slot_id) {
      await supabase
        .from("appointment_slots")
        .update({ is_booked: false })
        .eq("id", booking.slot_id);
    }

    revalidatePath("/booking");
    revalidatePath("/calendar");

    return { success: true };
  } catch (error: any) {
    console.error("Update booking status error:", error);
    return { error: error.message || "Failed to update booking status" };
  }
}
export async function getBookings() {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { data: business } = await supabase
    .from("business")
    .select("id")
    .eq("owner_id", userId)
    .single();

  if (!business) {
    return { error: "Business not found" };
  }

  const { data: bookingsData } = await supabase
    .from("bookings")
    .select(`
      id,
      customer_name,
      status,
      slot:appointment_slots(date, time)
    `)
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const formattedBookings = (bookingsData || []).map(booking => {
    const slotData = Array.isArray(booking.slot) ? booking.slot[0] : booking.slot;

    let dateLabel = "N/A";
    if (slotData?.date) {
      dateLabel = getLocalDateLabel(slotData.date);
    }

    return {
      id: `BK${booking.id.slice(0, 6).toUpperCase()}`,
      rawId: booking.id,
      customerName: booking.customer_name,
      date: dateLabel,
      time: slotData?.time ? slotData.time.slice(0, 5) : "N/A",
      status: (booking.status as BookingStatus) || "pending"
    };
  });

  return { success: true, bookings: formattedBookings };
}

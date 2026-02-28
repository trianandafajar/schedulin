"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import supabase from "./supabase";

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

    return { success: true };
  } catch (error: any) {
    console.error("Update booking status error:", error);
    return { error: error.message || "Failed to update booking status" };
  }
}

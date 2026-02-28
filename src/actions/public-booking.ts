"use server";

import supabase from "./supabase";

export interface PublicBookingData {
  businessId: string;
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export async function createPublicBooking(data: PublicBookingData) {
  try {
    // First, find or create a slot for this booking
    // Check if slot exists
    const { data: existingSlot } = await supabase
      .from("appointment_slots")
      .select("id, is_booked")
      .eq("business_id", data.businessId)
      .eq("date", data.date)
      .eq("time", data.time)
      .single();

    let slotId: string;

    if (existingSlot) {
      if (existingSlot.is_booked) {
        return { error: "This time slot has already been booked" };
      }
      slotId = existingSlot.id;
    } else {
      // Create new slot
      const { data: newSlot, error: slotError } = await supabase
        .from("appointment_slots")
        .insert({
          business_id: data.businessId,
          date: data.date,
          time: data.time,
          is_booked: true,
        })
        .select("id")
        .single();

      if (slotError || !newSlot) {
        console.error("Slot creation error:", slotError);
        return { error: slotError?.message || "Failed to create time slot" };
      }

      slotId = newSlot.id;
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        business_id: data.businessId,
        service_id: data.serviceId,
        slot_id: slotId,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        notes: data.notes,
        status: "pending",
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking error:", bookingError);
      // Rollback: free the slot
      await supabase
        .from("appointment_slots")
        .update({ is_booked: false })
        .eq("id", slotId);
      
      return { error: bookingError.message || "Failed to create booking" };
    }

    return { success: true, data: booking };
  } catch (error: any) {
    console.error("Create public booking error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

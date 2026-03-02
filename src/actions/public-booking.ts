"use server";

import supabase from "@/lib/supabase";


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
    const { data: business, error: businessError } = await supabase
      .from("business")
      .select("owner_id")
      .eq("id", data.businessId)
      .single();

    if (businessError || !business) {
      return { error: "Business not found" };
    }

    const { data: existingSlot } = await supabase
      .from("appointment_slots")
      .select("id, is_booked, is_disabled")
      .eq("business_id", data.businessId)
      .eq("date", data.date)
      .eq("time", data.time)
      .single();

    let slotId: string;

    if (existingSlot) {
      if (existingSlot.is_booked || existingSlot.is_disabled) {
        return { error: "This time slot is not available" };
      }

      await supabase
        .from("appointment_slots")
        .update({ is_booked: true })
        .eq("id", existingSlot.id);

      slotId = existingSlot.id;
    } else {
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
        return { error: slotError?.message || "Failed to create time slot" };
      }

      slotId = newSlot.id;
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        business_id: data.businessId,
        user_id: business.owner_id,
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
      await supabase
        .from("appointment_slots")
        .update({ is_booked: false })
        .eq("id", slotId);

      return { error: bookingError.message || "Failed to create booking" };
    }

    return { success: true, data: booking };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
}
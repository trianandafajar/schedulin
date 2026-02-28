"use server";

import supabase from "./supabase";

// Types
export interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  business_id: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  logo_url: string;
}

export interface BusinessSchedule {
  id: string;
  business_id: string;
  day_of_week: string;
  is_open: boolean;
  start_time: string | null;
  end_time: string | null;
}

export interface BookedSlot {
  id: string;
  date: string;
  time: string;
  is_booked: boolean;
}

// Get business by slug
export async function getBusinessBySlug(slug: string): Promise<{ data: Business | null; error: string | null }> {
  try {
    const { data: business, error } = await supabase
      .from("business")
      .select("id, name, slug, description, address, logo_url")
      .eq("slug", slug)
      .eq("is_public_enabled", true)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: business as Business, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "An unexpected error occurred" };
  }
}

// Get services by business ID
export async function getServicesByBusinessId(businessId: string): Promise<{ data: Service[] | null; error: string | null }> {
  try {
    const { data: services, error } = await supabase
      .from("services")
      .select("id, name, duration_minutes, price, is_active, business_id")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: services as Service[], error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "An unexpected error occurred" };
  }
}

// Get business schedule
export async function getBusinessSchedule(businessId: string): Promise<{ data: BusinessSchedule[] | null; error: string | null }> {
  try {
    const { data: schedule, error } = await supabase
      .from("business_schedules")
      .select("id, business_id, day_of_week, is_open, start_time, end_time")
      .eq("business_id", businessId)
      .order("day_of_week", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: schedule as BusinessSchedule[], error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "An unexpected error occurred" };
  }
}

// Get booked slots for a specific date
export async function getBookedSlots(businessId: string, date: string): Promise<{ data: BookedSlot[] | null; error: string | null }> {
  try {
    const { data: slots, error } = await supabase
      .from("appointment_slots")
      .select("id, date, time, is_booked")
      .eq("business_id", businessId)
      .eq("date", date)
      .eq("is_booked", true);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: slots as BookedSlot[], error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "An unexpected error occurred" };
  }
}

// Get all booked slots for a date range (for calendar highlighting)
export async function getBookedSlotsForMonth(businessId: string, year: number, month: number): Promise<{ data: string[] | null; error: string | null }> {
  try {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data: slots, error } = await supabase
      .from("appointment_slots")
      .select("date")
      .eq("business_id", businessId)
      .gte("date", startDate)
      .lte("date", endDate)
      .eq("is_booked", true);

    if (error) {
      return { data: null, error: error.message };
    }

    // Return array of booked dates
    const bookedDates = slots?.map(slot => slot.date) || [];
    return { data: bookedDates, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "An unexpected error occurred" };
  }
}

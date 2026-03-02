"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import supabase from "@/lib/supabase";


export interface DashboardBooking {
    id: string;
    status: string;
    customer_name: string;
    created_at: string;
    service: { name: string } | null;
    slot: { date: string; time: string } | null;
}

export async function getDashboardData(): Promise<{
    success?: boolean;
    bookings?: DashboardBooking[];
    error?: string;
    redirect?: string
}> {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized", redirect: "/sign-in" };
    }

    const { data: business } = await supabase
        .from("business")
        .select("id")
        .eq("owner_id", userId)
        .single();

    if (!business) {
        return { error: "No business found. Please create one first." };
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

    const formattedBookings: DashboardBooking[] = (bookings || []).map((b: any) => ({
        id: b.id,
        status: b.status,
        customer_name: b.customer_name,
        created_at: b.created_at,
        service: b.service ? (Array.isArray(b.service) ? b.service[0] : b.service) : null,
        slot: b.slot ? (Array.isArray(b.slot) ? b.slot[0] : b.slot) : null,
    }));

    return { success: true, bookings: formattedBookings };
}

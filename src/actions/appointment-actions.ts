"use server";

import supabase from "@/lib/supabase";

import { revalidatePath } from "next/cache";

export interface DaySchedule {
    isOpen: boolean;
    startTime: string;
    endTime: string;
}

export interface Holiday {
    id: string;
    date: string;
    name: string;
}

export async function getAppointmentSettings(businessId: string) {
    const { data: schedulesData } = await supabase
        .from("business_schedules")
        .select("*")
        .eq("business_id", businessId);

    const { data: holidaysData } = await supabase
        .from("business_holidays")
        .select("*")
        .eq("business_id", businessId);

    return { schedulesData: schedulesData || [], holidaysData: holidaysData || [] };
}

export async function saveAppointmentSettings(
    businessId: string,
    schedules: Record<string, DaySchedule>,
    holidays: Holiday[]
) {
    try {
        const schedulePayload = Object.entries(schedules).map(([day, data]) => ({
            business_id: businessId,
            day_of_week: day,
            is_open: data.isOpen,
            start_time: data.isOpen ? data.startTime : null,
            end_time: data.isOpen ? data.endTime : null,
        }));

        const { error: scheduleError } = await supabase
            .from("business_schedules")
            .upsert(schedulePayload, { onConflict: "business_id, day_of_week" });

        if (scheduleError) return { error: scheduleError.message };

        await supabase.from("business_holidays").delete().eq("business_id", businessId);

        if (holidays.length > 0) {
            const holidayPayload = holidays.map((h) => ({
                business_id: businessId,
                date: h.date,
                name: h.name,
            }));
            const { error: holidayError } = await supabase
                .from("business_holidays")
                .insert(holidayPayload);

            if (holidayError) return { error: holidayError.message };
        }

        revalidatePath("/(admin)/(others-pages)/appointment");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to save settings" };
    }
}

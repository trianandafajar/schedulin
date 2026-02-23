"use client";

import { useState, useEffect } from "react";
import AppointmentSettings from "@/components/appointment/AppointmentSettings";
import supabase from "@/actions/supabase";

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

export const getAppointmentSettings = async (businessId: string) => {
    const { data: schedulesData } = await supabase
        .from("business_schedules")
        .select("*")
        .eq("business_id", businessId);

    const { data: holidaysData } = await supabase
        .from("business_holidays")
        .select("*")
        .eq("business_id", businessId);

    return { schedulesData, holidaysData };
};

export const saveAppointmentSettings = async (
    businessId: string,
    schedules: Record<string, DaySchedule>,
    holidays: Holiday[]
) => {
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

    return { success: true };
};
interface AppointmentSettingsProps {
    business: {
        id: string;
        slug: string;
        is_public_enabled: boolean;
    }
}

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const AppointmentSettingsWrapper = ({ business }: AppointmentSettingsProps) => {
    const [schedules, setSchedules] = useState<Record<string, DaySchedule>>({});
    const [isLoading, setIsLoading] = useState(true);

    const [holidays, setHolidays] = useState<Holiday[]>([]);

    useEffect(() => {
        const loadSettings = async () => {
            setIsLoading(true);
            const { schedulesData, holidaysData } = await getAppointmentSettings(business.id);

            if (schedulesData && schedulesData.length > 0) {
                const formattedSchedules: Record<string, DaySchedule> = {};
                schedulesData.forEach((item) => {
                    formattedSchedules[item.day_of_week] = {
                        isOpen: item.is_open,
                        startTime: item.start_time ? item.start_time.substring(0, 5) : "09:00",
                        endTime: item.end_time ? item.end_time.substring(0, 5) : "17:00",
                    };
                });

                daysOfWeek.forEach((day) => {
                    if (!formattedSchedules[day]) {
                        formattedSchedules[day] = { isOpen: false, startTime: "09:00", endTime: "17:00" };
                    }
                });
                setSchedules(formattedSchedules);
            } else {
                const defaultSchedules: Record<string, DaySchedule> = {};
                daysOfWeek.forEach((day) => {
                    defaultSchedules[day] = { isOpen: day !== "Sunday", startTime: "09:00", endTime: "17:00" };
                });
                setSchedules(defaultSchedules);
            }

            if (holidaysData) {
                setHolidays(holidaysData.map(h => ({ id: h.id, date: h.date, name: h.name })));
            }
            setIsLoading(false);
        };

        loadSettings();
    }, [business.id]);

    const handleSave = async () => {
        await saveAppointmentSettings(
            business.id,
            schedules,
            holidays
        );
    };
    if (isLoading) {
        return <div className="p-6 text-center text-gray-500">Memuat pengaturan...</div>;
    }
    return (
        <AppointmentSettings
            business={business}
            schedules={schedules}
            holidays={holidays}
            setSchedules={setSchedules}
            setHolidays={setHolidays}
            onSave={handleSave}
        />
    );
};

export default AppointmentSettingsWrapper;
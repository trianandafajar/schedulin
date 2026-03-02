"use client";

import { useState, useEffect } from "react";
import AppointmentSettings from "@/components/appointment/AppointmentSettings";
import { getAppointmentSettings, saveAppointmentSettings, type DaySchedule, type Holiday } from "@/actions/appointment-actions";

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
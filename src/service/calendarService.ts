import supabase from "@/lib/supabase";


export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    extendedProps: {
        calendar: string;
        originalStart?: string;
        originalEnd?: string;
    };
}

export const getCalendarEvents = async (userId: string): Promise<CalendarEvent[]> => {
    const { data: manualEvents, error: manualError } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", userId);

    if (manualError) throw manualError;

    const { data: business } = await supabase
        .from("business")
        .select("id")
        .eq("owner_id", userId)
        .single();

    let bookingEvents: CalendarEvent[] = [];
    if (business) {
        const { data: bookingsData, error: bookingError } = await supabase
            .from("bookings")
            .select(`
                id,
                customer_name,
                status,
                service:services(name, duration_minutes),
                slot:appointment_slots(date, time)
            `)
            .eq("business_id", business.id)
            .neq("status", "cancelled");

        if (bookingError) throw bookingError;

        bookingEvents = (bookingsData || [])
            .filter((b: any) => b.slot)
            .map((b: any) => {
                const slot = Array.isArray(b.slot) ? b.slot[0] : b.slot;
                const service = Array.isArray(b.service) ? b.service[0] : b.service;

                const startDateTime = `${slot.date}T${slot.time}`;

                // Calculate end time based on service duration (default to 60 minutes)
                const durationMinutes = service?.duration_minutes || 60;
                
                const [year, month, day] = slot.date.split("-").map(Number);
                const [hour, minute] = slot.time.split(":").map(Number);
                const localStartDate = new Date(year, month - 1, day, hour, minute);
                const localEndDate = new Date(localStartDate.getTime() + durationMinutes * 60 * 1000);
                
                const pad = (num: number) => String(num).padStart(2, "0");
                const endDateTime = `${localEndDate.getFullYear()}-${pad(localEndDate.getMonth() + 1)}-${pad(localEndDate.getDate())}T${pad(localEndDate.getHours())}:${pad(localEndDate.getMinutes())}:${pad(localEndDate.getSeconds() || 0)}`;

                return {
                    id: b.id,
                    title: `${b.customer_name} - ${service?.name || 'Booking'}`,
                    start: startDateTime,
                    end: endDateTime,
                    allDay: false,
                    extendedProps: {
                        calendar: b.status === 'completed' ? 'success' : 'primary',
                        originalStart: startDateTime,
                        originalEnd: endDateTime,
                    },
                } as CalendarEvent;
            });

    }

    const manualFormatted = (manualEvents || []).map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start_date,
        end: event.end_date || undefined,
        allDay: event.is_all_day,
        extendedProps: {
            calendar: event.event_level,
            originalStart: event.start_date,
            originalEnd: event.end_date,
        },
    }));

    return [...manualFormatted, ...bookingEvents];
};


export const saveCalendarEvent = async (userId: string, eventData: any, id?: string) => {
    const eventPayload = {
        title: eventData.title,
        start_date: eventData.start,
        end_date: eventData.end || null,
        event_level: eventData.level,
        is_all_day: eventData.allDay,
        user_id: userId,
    };

    if (id) {
        const { error } = await supabase
            .from("calendar_events")
            .update(eventPayload)
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw error;
    } else {
        const { error } = await supabase
            .from("calendar_events")
            .insert([eventPayload]);

        if (error) throw error;
    }
};

export const deleteCalendarEvent = async (userId: string, id: string) => {
    const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (error) throw error;
};

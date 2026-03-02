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
    const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", userId);

    if (error) throw error;

    return (data || []).map((event) => ({
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

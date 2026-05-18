import { createClient } from "@/lib/supabase/client";


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
        isBooking?: boolean;
    };
}

export const getCalendarEvents = async (userId: string): Promise<CalendarEvent[]> => {
    const supabase = createClient();
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


                // Calculate end time based on service duration (default to 60 minutes if not specified)
                const durationMinutes = service?.duration_minutes || 60;
                const endDate = new Date(new Date(startDateTime).getTime() + durationMinutes * 60 * 1000);
                const endDateTime = endDate.toISOString();

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
                        isBooking: true,
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
            isBooking: false,
        },
    }));

    return [...manualFormatted, ...bookingEvents];
};


export const saveCalendarEvent = async (userId: string, eventData: any, id?: string) => {
    const supabase = createClient();
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

export const deleteCalendarEvent = async (userId: string, id: string, isBooking?: boolean) => {
    const supabase = createClient();
    if (isBooking) {
        const { data: booking, error: fetchErr } = await supabase
            .from("bookings")
            .select("slot_id")
            .eq("id", id)
            .single();
            
        if (fetchErr) throw fetchErr;

        const { error: cancelErr } = await supabase
            .from("bookings")
            .update({ status: "cancelled", updated_at: new Date().toISOString() })
            .eq("id", id);

        if (cancelErr) throw cancelErr;

        if (booking?.slot_id) {
            await supabase
                .from("appointment_slots")
                .update({ is_booked: false })
                .eq("id", booking.slot_id);
        }
    } else {
        const { error } = await supabase
            .from("calendar_events")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw error;
    }
};

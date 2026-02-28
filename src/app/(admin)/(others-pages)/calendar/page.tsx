"use client";

import React, { useState, useEffect, useCallback } from "react";
import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import supabase from "@/actions/supabase";
import { useAuth } from "@clerk/nextjs";

interface CalendarEvent {
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

export default function Page() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { userId, isLoaded } = useAuth();

  const loadEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const formattedEvents: CalendarEvent[] = data.map((event) => {
        return {
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
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoaded && userId) {
      loadEvents();
    }
  }, [isLoaded, userId, loadEvents]);

  const handleSaveEvent = async (eventData: any, id?: string) => {
    if (!userId) return;

    const eventPayload = {
      title: eventData.title,
      start_date: eventData.start,
      end_date: eventData.end || null,
      event_level: eventData.level,
      is_all_day: eventData.allDay,
      user_id: userId,
    };

    try {
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
      await loadEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      throw error;
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar events={events} onSaveEvent={handleSaveEvent} />
    </div>
  );
}
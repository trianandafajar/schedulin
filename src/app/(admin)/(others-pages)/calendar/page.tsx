"use client";

import React, { useState, useEffect, useCallback } from "react";
import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAuth } from "@clerk/nextjs";
import { getCalendarEvents, saveCalendarEvent, type CalendarEvent } from "@/service/calendarService";

export default function Page() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { userId, isLoaded } = useAuth();

  const loadEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const formattedEvents = await getCalendarEvents(userId);
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

    try {
      await saveCalendarEvent(userId, eventData, id);
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
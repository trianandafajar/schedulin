"use client";

import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "../ui/button/Button";

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

interface CalendarProps {
  events: CalendarEvent[];
  onSaveEvent: (eventData: any, id?: string) => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({ events, onSaveEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  const formatForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    const tzoffset = date.getTimezoneOffset() * 60000; 
    return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16); 
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setIsAllDay(selectInfo.allDay);

    let startStr = selectInfo.startStr;
    let endStr = selectInfo.endStr || selectInfo.startStr;

    // Tambahkan jam default jika user klik di blok yang tidak ada jamnya (misal: area bulan / all day)
    if (!startStr.includes("T")) startStr += "T09:00";
    if (!endStr.includes("T")) endStr += "T10:00";

    setEventStartDate(formatForInput(startStr));
    setEventEndDate(formatForInput(endStr));
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      extendedProps: {
        calendar: event.extendedProps.calendar,
        originalStart: event.extendedProps.originalStart,
        originalEnd: event.extendedProps.originalEnd
      }
    });
    
    setEventTitle(event.title);
    setIsAllDay(event.allDay);

    // Prioritaskan mengambil jam ASLI dari database jika tersedia, jika tidak ambil dari UI Fullcalendar
    let startStr = event.extendedProps.originalStart || event.startStr;
    let endStr = event.extendedProps.originalEnd || event.endStr || startStr;

    if (!startStr.includes("T")) startStr += "T09:00";
    if (!endStr.includes("T")) endStr += "T10:00";

    setEventStartDate(formatForInput(startStr));
    setEventEndDate(formatForInput(endStr));
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    setIsLoading(true);
    try {
      // Selalu konversi waktu utuh (Tanggal + Jam) ke UTC ISO String untuk disimpan
      const payloadStart = new Date(eventStartDate).toISOString();
      const payloadEnd = eventEndDate ? new Date(eventEndDate).toISOString() : null;

      await onSaveEvent(
        {
          title: eventTitle,
          start: payloadStart, 
          end: payloadEnd,
          level: eventLevel,
          allDay: isAllDay,
        },
        selectedEvent?.id
      );
      closeModal();
      resetModalFields();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setIsAllDay(false);
    setSelectedEvent(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          allDaySlot={true} 
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false 
          }}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: openModal,
            },
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h5>
          </div>
          <div className="mt-8">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Title
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div className="mt-5 flex items-center">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={() => setIsAllDay(!isAllDay)} 
                  className="mr-3 h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
                />
                Show as All Day Event
              </label>
            </div>
            
            <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Color
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div className={`form-check form-check-${value} form-check-inline`}>
                      <label className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400">
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-level"
                            value={value}
                            checked={eventLevel === value}
                            onChange={() => setEventLevel(value)}
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span className={`h-2 w-2 rounded-full ${eventLevel === value ? "bg-gray-800 dark:bg-white" : ""}`}></span>
                          </span>
                        </span>
                        {key}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Start Date & Time
              </label>
              <input
                type="datetime-local" 
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <Button onClick={closeModal} type="button" variant="outline">
              Close
            </Button>
            <Button
              onClick={handleAddOrUpdateEvent}
              type="button"
              disabled={!eventTitle || !eventLevel || !eventStartDate || isLoading}
              className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {isLoading ? "Saving..." : selectedEvent ? "Update Changes" : "Add Event"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const level = eventInfo.event.extendedProps.calendar?.toLowerCase() || "primary";
  const colorClass = `fc-bg-${level}`;

  return (
    <div
      className={`event-fc-color flex items-center fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      
      {!eventInfo.event.allDay && (
        <div className="fc-event-time font-semibold mr-2">{eventInfo.timeText}</div>
      )}
      <div className="fc-event-title truncate ">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
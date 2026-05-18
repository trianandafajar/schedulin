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
// import "./calendar-overrides.css"; 

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
  onDeleteEvent?: (id: string, isBooking?: boolean) => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({ events, onSaveEvent, onDeleteEvent }) => {
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
        originalEnd: event.extendedProps.originalEnd,
        isBooking: event.extendedProps.isBooking
      }
    });

    setEventTitle(event.title);
    setIsAllDay(event.allDay);

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
    if (eventEndDate && new Date(eventEndDate) < new Date(eventStartDate)) {
      alert("End time cannot be earlier than start time.");
      return;
    }
    setIsLoading(true);
    try {
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

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !onDeleteEvent) return;
    setIsLoading(true);
    try {
      await onDeleteEvent(selectedEvent.id, selectedEvent.extendedProps.isBooking);
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
    <div className="w-full bg-white dark:bg-[#151515] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 md:p-6 transition-all duration-300">
      <div className="calendar-container [&_.fc-theme-standard_.fc-scrollgrid]:border-gray-100 dark:[&_.fc-theme-standard_.fc-scrollgrid]:border-gray-800 [&_.fc-button-primary]:bg-blue-600 [&_.fc-button-primary]:border-blue-600 [&_.fc-button-primary:hover]:bg-blue-700 [&_.fc-button-primary:hover]:border-blue-700 [&_.fc-today-button]:bg-gray-100 [&_.fc-today-button]:text-gray-700 [&_.fc-today-button]:border-gray-200 dark:[&_.fc-today-button]:bg-gray-800 dark:[&_.fc-today-button]:text-gray-300 dark:[&_.fc-today-button]:border-gray-700 [&_.fc-col-header-cell]:py-3 [&_.fc-col-header-cell]:text-gray-500 [&_.fc-col-header-cell]:font-medium dark:[&_.fc-col-header-cell]:text-gray-400 [&_.fc-day-today]:bg-blue-50/30 dark:[&_.fc-day-today]:bg-blue-900/10">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          allDaySlot={true}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay addEventCustom",
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
          height="auto"
          dayMaxEvents={true}
          customButtons={{
            addEventCustom: {
              text: "+ New Event",
              click: openModal,
            },
          }}
        />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md w-full rounded-2xl p-0 overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        <div className="bg-gray-50 dark:bg-[#1a1a1a] px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedEvent ? "Edit Appointment" : "New Appointment"}
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5 bg-white dark:bg-[#111111]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              placeholder="e.g. Client Meeting"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none dark:border-gray-800 dark:bg-[#151515] dark:text-white dark:focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Starts
              </label>
              <input
                type="datetime-local"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none dark:[&::-webkit-calendar-picker-indicator]:invert dark:border-gray-800 dark:bg-[#151515] dark:text-white dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Ends
              </label>
              <input
                min={eventStartDate}
                type="datetime-local"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none dark:[&::-webkit-calendar-picker-indicator]:invert dark:border-gray-800 dark:bg-[#151515] dark:text-white dark:focus:border-blue-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors dark:border-gray-800 dark:hover:bg-[#151515]">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={() => setIsAllDay(!isAllDay)}
                className="peer sr-only"
              />
              <div className="h-5 w-5 rounded border border-gray-300 bg-white peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-colors dark:border-gray-700 dark:bg-[#222]"></div>
              <svg className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
              All Day Event
            </span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category / Color
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(calendarsEvents).map(([key, value]) => {
                const colors = {
                  danger: "bg-red-500 border-red-500 ring-red-500/20",
                  success: "bg-green-500 border-green-500 ring-green-500/20",
                  primary: "bg-blue-500 border-blue-500 ring-blue-500/20",
                  warning: "bg-yellow-500 border-yellow-500 ring-yellow-500/20",
                }[value] || "bg-gray-500 border-gray-500";

                const isSelected = eventLevel === value;

                return (
                  <label key={key} className="cursor-pointer group relative flex items-center">
                    <input
                      type="radio"
                      name="eventCategory"
                      value={value}
                      checked={isSelected}
                      onChange={() => setEventLevel(value)}
                      className="sr-only"
                    />
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      isSelected 
                        ? `${colors} text-white shadow-md ring-4` 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-[#222]'
                    }`}>
                      {!isSelected && <span className={`w-2 h-2 rounded-full ${colors.split(' ')[0]}`}></span>}
                      {key}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#1a1a1a] px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          {selectedEvent && onDeleteEvent && (
            <Button
              onClick={handleDeleteEvent}
              disabled={isLoading}
              type="button"
              className="mr-auto h-10 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium focus:ring-4 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Delete Event
            </Button>
          )}
          <Button onClick={closeModal} type="button" variant="outline" className="h-10 px-4 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#222]">
            Cancel
          </Button>
          <Button
            onClick={handleAddOrUpdateEvent}
            type="button"
            disabled={!eventTitle || !eventLevel || !eventStartDate || isLoading}
            className="h-10 px-5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Saving...
              </span>
            ) : selectedEvent ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const level = eventInfo.event.extendedProps.calendar?.toLowerCase() || "primary";
  
  const bgColors: Record<string, string> = {
    danger: "bg-red-100 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400",
    success: "bg-green-100 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400",
    primary: "bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400",
    warning: "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-400",
  };

  const dotColors: Record<string, string> = {
    danger: "bg-red-500",
    success: "bg-green-500",
    primary: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  const currentBgClass = bgColors[level] || bgColors.primary;
  const currentDotClass = dotColors[level] || dotColors.primary;

  return (
    <div className={`flex w-full flex-col overflow-hidden rounded-md border-l-4 border-l-current ${currentBgClass} p-1.5 transition-all hover:brightness-95`}>
      <div className="flex items-center gap-1.5">
        <div className={`h-2 w-2 flex-shrink-0 rounded-full ${currentDotClass}`}></div>
        <div className="truncate text-xs font-semibold leading-tight">{eventInfo.event.title}</div>
      </div>
      {!eventInfo.event.allDay && (
        <div className="mt-0.5 pl-3.5 text-[10px] font-medium opacity-80">
          {eventInfo.timeText}
        </div>
      )}
    </div>
  );
};

export default Calendar;
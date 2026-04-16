"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CopyIcon } from '@/icons';
import { togglePublicBooking } from "@/service/businessService";

interface AppointmentSettingsProps {
  business: {
    id: string;
    slug: string;
    is_public_enabled: boolean;
  };
  schedules: Record<string, DaySchedule>;
  holidays: Holiday[];
  setSchedules: Dispatch<SetStateAction<Record<string, DaySchedule>>>;
  setHolidays: Dispatch<SetStateAction<Holiday[]>>;
  onSave: () => any;
}

interface DaySchedule {
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

interface Holiday {
  id: string;
  date: string;
  name: string;
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

const AppointmentSettings: React.FC<AppointmentSettingsProps> = ({
  business,
  schedules,
  holidays,
  setSchedules,
  setHolidays,
  onSave
}) => {
  const [isPublic, setIsPublic] = useState(business.is_public_enabled);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookingLink, setBookingLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    setBookingLink(`${origin}/public/booking/${business.slug}`);
  }, [business.slug]);

  const handleTogglePublic = async () => {
    if (isToggling) return;
    
    const newState = !isPublic;
    setIsPublic(newState);
    setIsToggling(true);

    try {
      const result = await togglePublicBooking(business.id, newState);

      if (result?.error) {
        setIsPublic(!newState);
        alert("Gagal mengubah setting: " + result.error);
      }
    } catch (error) {
      setIsPublic(!newState);
      alert("Terjadi kesalahan sistem saat mengubah visibilitas.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScheduleChange = (
    day: string,
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleAddHoliday = () => {
    if (newHoliday.date && newHoliday.name) {
      setHolidays((prev) => [
        ...prev,
        { id: Date.now().toString(), ...newHoliday },
      ]);
      setNewHoliday({ date: "", name: "" });
    }
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111111]">
        <div className="border-b border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-[#151515]/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Booking Visibility
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Control whether external users can see and book appointments on your page.
              </p>
            </div>
            <button
              onClick={handleTogglePublic}
              disabled={isToggling}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-[#111111] ${
                isPublic ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
              } ${isToggling ? "opacity-70 pointer-events-none" : ""}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  isPublic ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div
            className={`flex flex-col gap-4 rounded-xl border p-4 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between ${
              isPublic
                ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10"
                : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isPublic ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                {isPublic ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                )}
              </div>
              <p className={`text-sm font-medium ${isPublic ? "text-green-800 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}>
                {isPublic ? "Your booking page is live and accessible to the public." : "Your booking page is currently private."}
              </p>
            </div>

            {isPublic && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-[#1a1a1a]">
                <code className="block max-w-[200px] truncate px-3 text-xs font-medium text-gray-600 dark:text-gray-300 sm:max-w-[300px]">
                  {bookingLink}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="flex h-8 items-center justify-center rounded-md bg-gray-50 px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:bg-[#222] dark:text-gray-300 dark:hover:bg-[#333]"
                >
                  {copied ? "Copied!" : <CopyIcon className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111111]">
        <div className="border-b border-gray-100 p-6 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Schedule
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define your standard operating hours for each day of the week.
          </p>
        </div>
        <div className="divide-y divide-gray-100 p-0 dark:divide-gray-800">
          {daysOfWeek.map((day) => {
            const isOpen = schedules[day].isOpen;
            return (
              <div
                key={day}
                className={`flex flex-col gap-4 p-6 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between ${
                  !isOpen ? "bg-gray-50/50 dark:bg-[#151515]/50" : "hover:bg-gray-50/30 dark:hover:bg-[#151515]/30"
                }`}
              >
                <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start sm:gap-6">
                  <div className="w-32">
                    <span className={`text-base font-medium ${isOpen ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
                      {day}
                    </span>
                  </div>
                  <label className="relative flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isOpen}
                      onChange={(e) => handleScheduleChange(day, "isOpen", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500 peer-focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:peer-focus:ring-offset-[#111111]"></div>
                    <span className={`ml-3 text-sm font-medium ${isOpen ? "text-brand-600 dark:text-brand-400" : "text-gray-400 dark:text-gray-500"}`}>
                      {isOpen ? "Open" : "Closed"}
                    </span>
                  </label>
                </div>

                <div className={`flex items-center gap-2 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-40"}`}>
                  <input
                    type="time"
                    value={schedules[day].startTime}
                    onChange={(e) => handleScheduleChange(day, "startTime", e.target.value)}
                    className="h-10 w-32 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-brand-500 dark:[&::-webkit-calendar-picker-indicator]:invert"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="time"
                    value={schedules[day].endTime}
                    onChange={(e) => handleScheduleChange(day, "endTime", e.target.value)}
                    className="h-10 w-32 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-brand-500 dark:[&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111111]">
        <div className="border-b border-gray-100 p-6 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Holidays & Exceptions
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add specific dates when your business will be closed regardless of the weekly schedule.
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-[#151515]/50 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Date</label>
              <input
                type="date"
                value={newHoliday.date}
                onChange={(e) => setNewHoliday((prev) => ({ ...prev, date: e.target.value }))}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-brand-500 dark:[&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div className="flex-[2]">
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Holiday Name / Reason</label>
              <input
                type="text"
                placeholder="e.g. New Year's Day"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white dark:focus:border-brand-500"
              />
            </div>
            <button
              onClick={handleAddHoliday}
              disabled={!newHoliday.date || !newHoliday.name}
              className="h-11 whitespace-nowrap rounded-xl bg-gray-900 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Add Date
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-[#151515] dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {holidays.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">
                      No upcoming holidays configured.
                    </td>
                  </tr>
                ) : (
                  holidays.map((holiday) => (
                    <tr key={holiday.id} className="bg-white hover:bg-gray-50 dark:bg-[#111111] dark:hover:bg-[#151515]">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {holiday.date}
                      </td>
                      <td className="px-6 py-4">
                        {holiday.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="sticky bottom-6 z-10 flex items-center justify-end rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-[#111111]/80">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={`relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl px-8 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
            isSaving 
              ? "bg-brand-400 cursor-not-allowed" 
              : "bg-brand-500 hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/20"
          }`}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Changes...
            </span>
          ) : (
            "Save All Settings"
          )}
        </button>
      </div>
    </div>
  );
};

export default AppointmentSettings;
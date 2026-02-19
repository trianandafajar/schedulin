"use client";
import React, { useEffect, useState } from "react";
import { CopyIcon } from '@/icons';
import { togglePublicBooking } from "@/service/businessService";

interface AppointmentSettingsProps {
  business: {
    id: string;
    slug: string;
    is_public_enabled: boolean;
  };
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

const AppointmentSettings: React.FC<AppointmentSettingsProps> = ({ business }) => {
  const [isPublic, setIsPublic] = useState(business.is_public_enabled);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookingLink, setBookingLink] = useState("");
  useEffect(() => {
    const origin = window.location.origin;
    setBookingLink(`${origin}/public/booking/${business.slug}`);
  }, [business.slug]);

  const [schedules, setSchedules] = useState<Record<string, DaySchedule>>({
    Monday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
    Tuesday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
    Wednesday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
    Thursday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
    Friday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
    Saturday: { isOpen: false, startTime: "09:00", endTime: "13:00" },
    Sunday: { isOpen: false, startTime: "", endTime: "" },
  });

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: "1", date: "2026-01-01", name: "New Year's Day" },
    { id: "2", date: "2026-12-25", name: "Christmas" },
  ]);

  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });

  const handleTogglePublic = async () => {
    const newState = !isPublic;
    setIsPublic(newState);
    setIsToggling(true);

    const result = await togglePublicBooking(business.id, newState);

    if (result.error) {
      setIsPublic(!newState);
      alert("Gagal mengubah setting: " + result.error);
    }
    setIsToggling(false);
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

  const handleSaveSettings = () => {
    const settings = {
      isPublic,
      schedules,
      holidays,
    };
    console.log("Saving to DB:", settings);
    alert("Jadwal dan Libur berhasil disimpan (Simulasi LocalStorage)!");
    localStorage.setItem("appointmentSettings", JSON.stringify(settings));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Booking Visibility
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Public Booking
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Allow external users to book appointments
            </p>
          </div>
          <button
            onClick={handleTogglePublic}
            disabled={isToggling}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isPublic ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isPublic ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
        </div>
        <div
          className={`mt-4 rounded-lg p-3 ${isPublic
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
        >
          {isPublic ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>✓ Booking system is public. Customers can access the booking page.</span>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <code className="px-2 py-1 text-xs bg-white/50 rounded dark:bg-black/20 select-all">
                  {bookingLink}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="p-1 hover:bg-white/50 rounded dark:hover:bg-black/20"
                  title="Copy Link"
                >
                  {copied ? <span className="text-xs font-bold">Copied</span> : <CopyIcon className="w-4 h-4 fill-current" />}
                </button>
              </div>
            </div>
          ) : (
            "✗ Booking system is private. Only admins can manage appointments."
          )}
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Opening Hours
        </h3>
        <div className="space-y-3">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-100 p-3 dark:border-strokedark"
            >
              <div className="w-28">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schedules[day].isOpen}
                  onChange={(e) =>
                    handleScheduleChange(day, "isOpen", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Open
                </span>
              </label>
              {schedules[day].isOpen && (
                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                  <input
                    type="time"
                    value={schedules[day].startTime}
                    onChange={(e) =>
                      handleScheduleChange(day, "startTime", e.target.value)
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-strokedark dark:bg-gray-800 dark:text-white focus:border-brand-500 outline-none"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={schedules[day].endTime}
                    onChange={(e) =>
                      handleScheduleChange(day, "endTime", e.target.value)
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-strokedark dark:bg-gray-800 dark:text-white focus:border-brand-500 outline-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Holidays / Closed Days
        </h3>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="date"
            value={newHoliday.date}
            onChange={(e) =>
              setNewHoliday((prev) => ({ ...prev, date: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-strokedark dark:bg-gray-800 dark:text-white outline-none focus:border-brand-500"
          />
          <input
            type="text"
            placeholder="Holiday name"
            value={newHoliday.name}
            onChange={(e) =>
              setNewHoliday((prev) => ({ ...prev, name: e.target.value }))
            }
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-strokedark dark:bg-gray-800 dark:text-white min-w-[200px] outline-none focus:border-brand-500"
          />
          <button
            onClick={handleAddHoliday}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Add Holiday
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-strokedark">
                <th className="py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr
                  key={holiday.id}
                  className="border-b border-gray-100 dark:border-strokedark last:border-0"
                >
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {holiday.date}
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {holiday.name}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteHoliday(holiday.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {holidays.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">
              No holidays configured
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AppointmentSettings;
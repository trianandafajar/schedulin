"use client";
import React, { useState } from "react";

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

const AppointmentSettings: React.FC = () => {
  const [isPublic, setIsPublic] = useState(true);
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
    // Save settings to backend/localStorage
    const settings = {
      isPublic,
      schedules,
      holidays,
    };
    localStorage.setItem("appointmentSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Public/Private Toggle */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
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
            onClick={() => setIsPublic(!isPublic)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              isPublic ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                isPublic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div
          className={`mt-4 rounded-lg p-3 ${
            isPublic
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {isPublic
            ? "✓ Booking system is public. Customers can access the booking page."
            : "✗ Booking system is private. Only admins can manage appointments."}
        </div>
      </div>

      {/* Opening Hours */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Opening Hours
        </h3>
        <div className="space-y-3">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-100 p-3 dark:border-gray-700"
            >
              <div className="w-28">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={schedules[day].isOpen}
                  onChange={(e) =>
                    handleScheduleChange(day, "isOpen", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Open
                </span>
              </label>
              {schedules[day].isOpen && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={schedules[day].startTime}
                    onChange={(e) =>
                      handleScheduleChange(day, "startTime", e.target.value)
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={schedules[day].endTime}
                    onChange={(e) =>
                      handleScheduleChange(day, "endTime", e.target.value)
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Holidays */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
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
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            placeholder="Holiday name"
            value={newHoliday.name}
            onChange={(e) =>
              setNewHoliday((prev) => ({ ...prev, name: e.target.value }))
            }
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white min-w-[200px]"
          />
          <button
            onClick={handleAddHoliday}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Add Holiday
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
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
                  className="border-b border-gray-100 dark:border-gray-800"
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

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AppointmentSettings;

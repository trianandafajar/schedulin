"use client";

import { useState } from "react";
import { Calendar, Clock, Scissors, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button/Button";

export default function PublicBookingPage() {
  const today = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const business = {
    service: "Humble Cut",
    duration: "45 mins with Maman",
    price: 40000,
  };

  const bookedSlots: Record<string, string[]> = {
    "2026-02-10": ["09:00", "09:15", "09:30"],
    "2026-02-15": ["FULL"],
  };

  const formatDateKey = (date: Date) =>
    date.toISOString().split("T")[0];

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = 9 + Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour}:${minute === 0 ? "00" : minute}`;
  });

  const selectedKey = formatDateKey(selectedDate);
  const bookedForSelected = bookedSlots[selectedKey] || [];

  const isPastDate = (date: Date) => {
    // Set time to 00:00:00 for comparison
    const dateToCompare = new Date(date);
    dateToCompare.setHours(0, 0, 0, 0);
    
    const todayCompare = new Date(today);
    todayCompare.setHours(0, 0, 0, 0);
    
    return dateToCompare < todayCompare;
  };

  const isPastTime = (date: Date, time: string) => {
    const now = new Date();
    const [hour, minute] = time.split(":").map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hour, minute, 0, 0);
    return slotDate < now;
  };

  const goToPreviousMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return newDate;
    });
    setSelectedTime(null);
  };

  const goToNextMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return newDate;
    });
    setSelectedTime(null);
  };

  const handleDateSelect = (date: Date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-xl font-semibold text-blue-700">
            Book Appointment
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">

            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-lg">
                    {selectedDate.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={goToPreviousMonth}
                    className="p-1 roundedtransition"
                    variant="outline"
                    aria-label="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5 " />
                  </Button>
                  <Button
                    onClick={goToNextMonth}
                    className="p-1 rounded transition"
                    aria-label="Bulan berikutnya"
                    variant="outline"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-3">
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: lastDateOfMonth }).map((_, i) => {
                  const date = i + 1;
                  const fullDate = new Date(currentYear, currentMonth, date);

                  const isSelected =
                    date === selectedDate.getDate() &&
                    fullDate.getMonth() === selectedDate.getMonth() &&
                    fullDate.getFullYear() === selectedDate.getFullYear();

                  const isPast = isPastDate(fullDate);

                  return (
                    <button
                      key={date}
                      disabled={isPast}
                      onClick={() => handleDateSelect(fullDate)}
                      className={`p-2 rounded-full text-center transition
                        ${isPast ? "line-through text-gray-300 cursor-not-allowed bg-gray-50" : ""}
                        ${isSelected && !isPast
                          ? "bg-blue-600 text-white"
                          : !isPast && "hover:bg-blue-100"
                        }
                      `}
                    >
                      {date}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && !isPastDate(selectedDate) && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">
                    {selectedDate.toDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {times.map((time) => {
                    const isBooked =
                      bookedForSelected.includes(time);

                    const isFullDay =
                      bookedForSelected.includes("FULL");

                    const pastTime =
                      formatDateKey(selectedDate) === formatDateKey(new Date()) &&
                      isPastTime(selectedDate, time);

                    const disabled =
                      isBooked || isFullDay || pastTime;

                    return (
                      <button
                        key={time}
                        disabled={disabled}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 border rounded-xl text-sm transition
                          ${selectedTime === time
                            ? "bg-blue-600 text-white border-blue-600"
                            : ""
                          }
                          ${disabled
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                            : "hover:bg-blue-100"
                          }
                        `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDate && isPastDate(selectedDate) && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">Silakan pilih tanggal yang tersedia</p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-blue-50 rounded-2xl shadow-md p-6 border flex flex-col gap-5 sticky top-6">

              <h3 className="font-semibold text-lg text-blue-700">
                Booking Summary
              </h3>

              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">

                  <div className="flex flex-col">
                    <span className="font-medium">
                      {business.service}
                    </span>
                    <span className="text-sm text-gray-500">
                      {business.duration}
                    </span>

                    {selectedTime && selectedDate && !isPastDate(selectedDate) && (
                      <span className="text-sm text-gray-400 mt-1">
                        {selectedDate.toDateString()} • {selectedTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-semibold text-blue-700">
                  Rp {business.price.toLocaleString()}
                </div>
              </div>

              <div className="h-px bg-blue-200" />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  Rp {business.price.toLocaleString()}
                </span>
              </div>

              <Button
                disabled={!selectedTime || (selectedDate && isPastDate(selectedDate))}
                className="mt-4 py-3 "
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
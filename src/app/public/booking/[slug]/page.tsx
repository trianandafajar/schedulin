"use client";

import { useState, useEffect, use, useMemo, useCallback } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, Scissors, Check, Loader2, User, Phone, MapPin, Inbox } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { getBusinessBySlug, getServicesByBusinessId, getBusinessSchedule, getBookedSlots, getBusinessHolidays, Service, BusinessSchedule, BusinessHoliday } from "@/actions/public";
import { createPublicBooking } from "@/actions/public-booking";
import Label from "@/components/form/Label";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicBookingPage({ params }: PageProps) {
  const { slug } = use(params);

  const [today] = useState(() => new Date());

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [schedule, setSchedule] = useState<BusinessSchedule[]>([]);
  const [holidays, setHolidays] = useState<BusinessHoliday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [disabledTimes, setDisabledTimes] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const { data: business, error: businessError } = await getBusinessBySlug(slug);

        if (!isMounted) return;

        if (businessError || !business) {
          setError("Business not found or not available for public booking");
          setLoading(false);
          return;
        }

        setBusinessId(business.id);
        setBusinessName(business.name);

        const [servicesRes, scheduleRes, holidaysRes] = await Promise.all([
          getServicesByBusinessId(business.id),
          getBusinessSchedule(business.id),
          getBusinessHolidays(business.id)
        ]);

        if (!isMounted) return;

        if (servicesRes.data) setServices(servicesRes.data);
        if (scheduleRes.data) setSchedule(scheduleRes.data);
        if (holidaysRes.data) setHolidays(holidaysRes.data);

      } catch (err) {
        if (isMounted) setError("Failed to load business data");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    let isMounted = true;

    async function loadSlots() {
      if (!businessId || !selectedDate) {
        setBookedTimes([]);
        setDisabledTimes([]);
        return;
      }

      const dateStr = [
        selectedDate.getFullYear(),
        String(selectedDate.getMonth() + 1).padStart(2, "0"),
        String(selectedDate.getDate()).padStart(2, "0"),
      ].join("-");
      
      const { data: slots, error } = await getBookedSlots(businessId, dateStr);

      if (!isMounted) return;

      if (error || !slots) {
        setBookedTimes([]);
        setDisabledTimes([]);
        return;
      }

      const booked: string[] = [];
      const disabled: string[] = [];

      slots.forEach((slot: any) => {
        const [hours, minutes] = slot.time.split(":");
        const formatted = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

        if (slot.is_disabled) {
          disabled.push(formatted);
        } else {
          booked.push(formatted);
        }
      });

      setBookedTimes(booked);
      setDisabledTimes(disabled);
    }

    loadSlots();

    return () => {
      isMounted = false;
    };
  }, [businessId, selectedDate]);

  const getDayName = useCallback((date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }, []);

  const businessHours = useMemo(() => {
    if (schedule.length === 0) return { start: 9, end: 17 };
    if (!selectedDate) return { start: 9, end: 17 };

    const dayName = getDayName(selectedDate);
    const daySchedule = schedule.find(s => s.day_of_week === dayName);

    if (!daySchedule || !daySchedule.is_open || !daySchedule.start_time || !daySchedule.end_time) {
      return null;
    }

    return {
      start: parseInt(daySchedule.start_time.split(':')[0], 10),
      end: parseInt(daySchedule.end_time.split(':')[0], 10)
    };
  }, [schedule, selectedDate, getDayName]);

  const timeSlots = useMemo(() => {
    if (!businessHours || !selectedService?.duration_minutes) return [];

    const slots: string[] = [];
    const duration = selectedService.duration_minutes;
    const startInMinutes = businessHours.start * 60;
    const endInMinutes = businessHours.end * 60;

    for (let time = startInMinutes; time < endInMinutes; time += duration) {
      const h = Math.floor(time / 60);
      const m = time % 60;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }

    return slots;
  }, [businessHours, selectedService]);

  const calendarData = useMemo(() => {
    const currentMonth = selectedDate ? selectedDate.getMonth() : today.getMonth();
    const currentYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return { currentMonth, currentYear, startDay: firstDayOfMonth.getDay(), lastDateOfMonth };
  }, [selectedDate, today]);

  const { currentMonth, currentYear, startDay, lastDateOfMonth } = calendarData;

  const goToPreviousMonth = useCallback(() => {
    setSelectedDate(prev => prev 
      ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1) 
      : new Date(today.getFullYear(), today.getMonth() - 1, 1)
    );
    setSelectedTime(null);
  }, [today]);

  const goToNextMonth = useCallback(() => {
    setSelectedDate(prev => prev 
      ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1) 
      : new Date(today.getFullYear(), today.getMonth() + 1, 1)
    );
    setSelectedTime(null);
  }, [today]);

  const isPastDate = useCallback((date: Date) => {
    const dateToCompare = new Date(date);
    dateToCompare.setHours(0, 0, 0, 0);
    const todayCompare = new Date(today);
    todayCompare.setHours(0, 0, 0, 0);
    return dateToCompare < todayCompare;
  }, [today]);

  const isDateDisabled = useCallback((date: Date) => {
    if (isPastDate(date)) return true;

    const dateStr = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    
    if (holidays.some(h => h.date === dateStr)) return true;

    const dayName = getDayName(date);
    const daySchedule = schedule.find(s => s.day_of_week === dayName);
    return daySchedule ? !daySchedule.is_open : false;
  }, [isPastDate, holidays, schedule, getDayName]);

  const handleDateSelect = useCallback((date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  }, [isDateDisabled]);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const handleServiceSelect = useCallback((service: Service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setSelectedTime(null);
  }, []);

  const resetService = useCallback(() => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
  }, []);

  const openBookingModal = useCallback(() => {
    setBookingError(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerNotes("");
    setIsModalOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setIsModalOpen(false);
    setBookingError(null);
  }, []);

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !businessId) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const dateStr = [
        selectedDate.getFullYear(),
        String(selectedDate.getMonth() + 1).padStart(2, "0"),
        String(selectedDate.getDate()).padStart(2, "0"),
      ].join("-");

      const [hours, minutes] = selectedTime.split(':');
      const timeStr = `${hours}:${minutes}:00`;

      const result = await createPublicBooking({
        businessId,
        serviceId: selectedService.id,
        date: dateStr,
        time: timeStr,
        customerName,
        customerPhone,
        notes: customerNotes || undefined,
      });

      if (result.error) {
        setBookingError(result.error);
      } else {
        setBookingSuccess(true);
      }
    } catch (err: any) {
      setBookingError(err.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentNow = new Date();
  const todayCompare = new Date(today);
  todayCompare.setHours(0, 0, 0, 0);
  const selectedCompare = selectedDate ? new Date(selectedDate) : new Date(today);
  selectedCompare.setHours(0, 0, 0, 0);
  const isSelectedSameAsToday = todayCompare.getTime() === selectedCompare.getTime();

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 font-sans flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-blue-800 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <MapPin className="w-8 h-8 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Notice</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md">
          <div className="w-16 h-16 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-5">
            Your appointment has been successfully booked.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left mb-6 space-y-2">
            <p className="text-sm font-semibold text-blue-800">{selectedService?.name}</p>
            <p className="text-xs text-gray-600">
              {selectedDate?.toDateString()}
            </p>
            <p className="text-xs font-medium text-gray-600">
              {selectedTime}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full">
            Book Another Appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans pt-12">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="flex flex-col lg:flex-row gap-10">

          <div className="w-full lg:w-96 order-1 lg:order-1">
            <div className="bg-blue-50 rounded-2xl shadow-xl p-6 border flex flex-col gap-6 sticky top-6">

              <h3 className="font-bold text-xl text-blue-800">
                  {businessName} - Booking Details
              </h3>

              <div>
                <Label className="text-gray-500 mb-1">Service</Label>
                {selectedService ? (
                  <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-4">
                    <span className="font-semibold text-gray-800">
                      {selectedService.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedService.duration_minutes} minutes
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border-dashed border border-gray-200 text-center text-gray-400">
                    <Scissors className="w-6 h-6 mx-auto mb-2 opacity-50"/>
                    <span className="text-xs">Select a service</span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-500 mb-1">Date & Time</Label>
                {selectedTime && selectedDate ? (
                  <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-4 space-y-1">
                    <span className="text-sm font-semibold text-gray-800">{selectedDate.toDateString()}</span>
                    <span className="text-sm font-medium text-gray-600">{selectedTime}</span>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border-dashed border border-gray-200 text-center text-gray-400">
                     <Clock className="w-6 h-6 mx-auto mb-2 opacity-50"/>
                    <span className="text-xs">Select schedule</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-blue-100" />

              <div className="flex justify-between font-extrabold text-lg">
                <span className="text-gray-800">Subtotal</span>
                <span className="text-blue-800">
                  {selectedService ? `Rp ${selectedService.price.toLocaleString()}` : "Rp 0"}
                </span>
              </div>

              <Button
                disabled={!selectedService || !selectedTime || !selectedDate}
                className="w-full py-3"
                onClick={openBookingModal}
              >
                Confirm Booking
              </Button>
            </div>
          </div>

          <div className="flex-1 order-2 lg:order-2 space-y-10">

            {selectedService && (
               <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-800" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{selectedService.name}</div>
                    <div className="text-xs text-gray-500">
                      {selectedService.duration_minutes} minutes • Rp {selectedService.price.toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                    onClick={resetService}
                    className="text-sm text-blue-800 font-medium hover:underline"
                >
                    Change Service
                </button>
              </div>
            )}

            {!selectedService ? (
               <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-blue-800" />
                  <span className="font-bold text-2xl text-gray-800">1. Select Service</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.length > 0 ? services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="p-5 border-2 border-gray-100 rounded-2xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all space-y-2 group"
                    >
                      <div className="font-semibold text-lg text-gray-800 group-hover:text-blue-900">{service.name}</div>
                      <div className="text-sm text-gray-500">
                        Duration: {service.duration_minutes} minutes
                      </div>
                      <div className="text-blue-800 font-bold text-lg pt-1">
                        Rp {service.price.toLocaleString()}
                      </div>
                    </button>
                  )) : (
                    <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border-dashed border border-gray-200">
                      <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium text-sm">No services available</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-800" />
                                <span className="font-semibold text-lg">
                                    {currentMonth !== undefined
                                        ? new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })
                                        : "Select Date"
                                    }
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    onClick={goToPreviousMonth}
                                    className="p-1 rounded transition size-8 flex items-center justify-center"
                                >
                                   Prev
                                </Button>
                                <Button
                                    onClick={goToNextMonth}
                                    className="p-1 rounded transition size-8 flex items-center justify-center"
                                    
                                >
                                    Next
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
                            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d, i) => (
                                <div key={d} className={i === 0 || i === 6 ? "text-red-400" : ""}>{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: startDay }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {Array.from({ length: lastDateOfMonth }).map((_, i) => {
                                const date = i + 1;
                                const fullDate = new Date(currentYear, currentMonth, date);

                                const isSelected = selectedDate &&
                                    date === selectedDate.getDate() &&
                                    fullDate.getMonth() === selectedDate.getMonth() &&
                                    fullDate.getFullYear() === selectedDate.getFullYear();

                                const isDisabled = isDateDisabled(fullDate);

                                return (
                                    <button
                                        key={date}
                                        disabled={isDisabled}
                                        onClick={() => handleDateSelect(fullDate)}
                                        className={`size-10 rounded-xl text-center transition font-semibold text-sm
                                          ${isDisabled ? "text-gray-300 cursor-not-allowed bg-gray-50" : "text-gray-800"}
                                          ${isSelected && !isDisabled
                                              ? "bg-blue-800 text-white"
                                              : !isDisabled && "hover:bg-blue-100"
                                          }
                                        `}
                                    >
                                        {date}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedService && selectedDate && !isDateDisabled(selectedDate) && (
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-800" />
                                <span className="font-semibold text-lg">
                                    Time slots for {selectedDate.getDate()} {new Date(currentYear, currentMonth).toLocaleString("default", { month: "short" })}
                                </span>
                            </div>

                            {timeSlots.length > 0 ? (
                                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                                    {timeSlots.map((time) => {
                                        const isBooked = bookedTimes.includes(time);
                                        const isManuallyDisabled = disabledTimes.includes(time);

                                        let isPastSlot = false;
                                        if (isSelectedSameAsToday && selectedDate) {
                                            const [hour, minute] = time.split(":").map(Number);
                                            const slotDate = new Date(selectedDate);
                                            slotDate.setHours(hour, minute, 0, 0);
                                            isPastSlot = slotDate < currentNow;
                                        }

                                        const disabled = isBooked || isManuallyDisabled || isPastSlot;

                                        return (
                                            <button
                                                key={time}
                                                disabled={disabled}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`p-3 border font-semibold rounded-xl text-xs transition
                                                    ${selectedTime === time ? "bg-blue-800 text-white border-blue-800" : "text-gray-800"}
                                                    ${disabled ? "bg-gray-200 text-gray-300 cursor-not-allowed line-through" : "border-gray-100 hover:bg-blue-100 hover:border-blue-100"}
                                                  `}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border-dashed border border-gray-200">
                                    <Clock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                    <p className="font-medium text-xs">No slots available for this date</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeBookingModal}
        className="max-w-[500px] p-0 rounded-3xl overflow-hidden"
      >
        <div className="flex flex-col">
          <div className="bg-gray-50 border-b border-gray-100 p-8 space-y-1">
            <h5 className="font-bold text-2xl text-gray-800">
                Contact Information
            </h5>
            <p className="text-sm text-gray-500">Provide your details to complete the booking</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleConfirmBooking(); }} className="p-8 space-y-5">
            <div>
              <Label className="mb-1.5 text-gray-700">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-800 focus:ring-blue-800/10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5 text-gray-700">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-800 focus:ring-blue-800/10"
                  placeholder="08123..."
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5 text-gray-700">Notes (Optional)</Label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3}
                className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-800 focus:ring-blue-800/10"
                placeholder="Special requests or notes..."
              />
            </div>

            {bookingError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600 font-medium">{bookingError}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <Button
                type="button"
                onClick={closeBookingModal}
                variant="outline"
                disabled={isSubmitting}
                className="w-full sm:w-auto sm:ml-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!customerName || !customerPhone || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Create Booking"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
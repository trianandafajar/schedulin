"use client";

import { useState, useEffect, use } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, Scissors, Check, Loader2, User, Phone } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { getBusinessBySlug, getServicesByBusinessId, getBusinessSchedule, getBookedSlots, Service, BusinessSchedule } from "@/actions/public";
import { createPublicBooking } from "@/actions/public-booking";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicBookingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const today = new Date();
  
  // State
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [schedule, setSchedule] = useState<BusinessSchedule[]>([]);
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

  useEffect(() => {
    async function loadData() {
      try {
        // Get business by slug
        const { data: business, error: businessError } = await getBusinessBySlug(slug);
        
        if (businessError || !business) {
          setError("Business not found or not available for public booking");
          setLoading(false);
          return;
        }

        setBusinessId(business.id);
        setBusinessName(business.name);

        // Get services
        const { data: servicesData, error: servicesError } = await getServicesByBusinessId(business.id);
        
        if (servicesError) {
          console.error("Services error:", servicesError);
        } else if (servicesData) {
          setServices(servicesData);
        }

        // Get schedule
        const { data: scheduleData, error: scheduleError } = await getBusinessSchedule(business.id);
        
        if (scheduleError) {
          console.error("Schedule error:", scheduleError);
        } else if (scheduleData) {
          setSchedule(scheduleData);
        }

      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load business data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  // Load booked slots when date is selected
  useEffect(() => {
    async function loadBookedSlots() {
      if (!businessId || !selectedDate) {
        setBookedTimes([]);
        return;
      }

      const dateStr = selectedDate.toISOString().split("T")[0];
      const { data: slots, error } = await getBookedSlots(businessId, dateStr);
      
      if (error) {
        console.error("Error loading booked slots:", error);
        setBookedTimes([]);
      } else if (slots) {
        // Convert time to string format matching our display format
        const times = slots.map(slot => {
          const [hours, minutes] = slot.time.split(':');
          return `${hours}:${minutes}`;
        });
        setBookedTimes(times);
      }
    }

    loadBookedSlots();
  }, [businessId, selectedDate]);

  // Get business hours for a specific day
  const getDayName = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const getBusinessHours = (): { start: number; end: number } | null => {
    if (schedule.length === 0) {
      // Default hours if no schedule
      return { start: 9, end: 17 };
    }

    if (!selectedDate) return { start: 9, end: 17 };

    const dayName = getDayName(selectedDate);
    const daySchedule = schedule.find(s => s.day_of_week === dayName);

    if (!daySchedule || !daySchedule.is_open || !daySchedule.start_time || !daySchedule.end_time) {
      return null;
    }

    const startHour = parseInt(daySchedule.start_time.split(':')[0]);
    const endHour = parseInt(daySchedule.end_time.split(':')[0]);

    return { start: startHour, end: endHour };
  };

  const generateTimeSlots = (): string[] => {
    const hours = getBusinessHours();
    if (!hours) return [];

    const slots: string[] = [];
    for (let h = hours.start; h < hours.end; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(`${h}:${m === 0 ? '00' : m}`);
      }
    }
    return slots;
  };

  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

  const currentMonth = selectedDate ? selectedDate.getMonth() : today.getMonth();
  const currentYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();

  const goToPreviousMonth = () => {
    setSelectedDate(prev => {
      const newDate = prev ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1) : new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return newDate;
    });
    setSelectedTime(null);
  };

  const goToNextMonth = () => {
    setSelectedDate(prev => {
      const newDate = prev ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1) : new Date(today.getFullYear(), today.getMonth() + 1, 1);
      return newDate;
    });
    setSelectedTime(null);
  };

  const isPastDate = (date: Date) => {
    const dateToCompare = new Date(date);
    dateToCompare.setHours(0, 0, 0, 0);
    
    const todayCompare = new Date(today);
    todayCompare.setHours(0, 0, 0, 0);
    
    return dateToCompare < todayCompare;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; 
  };

  const isDateDisabled = (date: Date) => {
    return isPastDate(date) || isWeekend(date);
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const resetService = () => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const openBookingModal = () => {
    setBookingError(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerNotes("");
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setBookingError(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !businessId) {
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      
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

  const timeSlots = generateTimeSlots();

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-lg p-8 max-w-md">
          <div className="text-red-500 mb-4">
            <Calendar className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your appointment has been successfully booked.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 text-left mb-4">
            <p className="font-semibold text-blue-700">{selectedService?.name}</p>
            <p className="text-sm text-gray-600">
              {selectedDate?.toDateString()} at {selectedTime}
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Book Another Appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-xl font-semibold text-blue-700">
            Book Appointment - {businessName}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            
            {/* Service Selection */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-lg">Select Service</span>
                </div>
                {selectedService && (
                  <button 
                    onClick={resetService}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>

              {!selectedService ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.length > 0 ? services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="p-4 border-2 border-gray-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <div className="font-semibold text-gray-800">{service.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {service.duration_minutes} minutes
                      </div>
                      <div className="text-blue-600 font-semibold mt-2">
                        Rp {service.price.toLocaleString()}
                      </div>
                    </button>
                  )) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      <Scissors className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No services available</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{selectedService.name}</div>
                      <div className="text-sm text-gray-500">
                        {selectedService.duration_minutes} minutes • Rp {selectedService.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedService && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-lg">
                      {selectedDate 
                        ? selectedDate.toLocaleString("default", { month: "long", year: "numeric" })
                        : "Select Date"
                      }
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={goToPreviousMonth}
                      className="p-1 rounded transition"
                      variant="outline"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={goToNextMonth}
                      className="p-1 rounded transition"
                      aria-label="Next month"
                      variant="outline"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-3">
                  {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d, i) => (
                    <div key={d} className={i === 0 || i === 6 ? "text-red-400" : ""}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
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
                        className={`p-2 rounded-full text-center transition
                          ${isDisabled ? "text-gray-300 cursor-not-allowed bg-gray-50" : ""}
                          ${isSelected && !isDisabled
                            ? "bg-blue-600 text-white"
                            : !isDisabled && "hover:bg-blue-100"
                          }
                        `}
                      >
                        {date}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  * Saturday and Sunday are unavailable
                </p>
              </div>
            )}

            {selectedService && selectedDate && !isDateDisabled(selectedDate) && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">
                    Select Time - {selectedDate.toDateString()}
                  </span>
                </div>

                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map((time) => {
                      const isBooked = bookedTimes.includes(time);
                      
                      const isPast = () => {
                        if (!selectedDate) return false;
                        const now = new Date();
                        const [hour, minute] = time.split(':').map(Number);
                        const slotDate = new Date(selectedDate);
                        slotDate.setHours(hour, minute, 0, 0);
                        const todayCompare = new Date(now);
                        todayCompare.setHours(0, 0, 0, 0);
                        const selectedCompare = new Date(selectedDate);
                        selectedCompare.setHours(0, 0, 0, 0);
                        
                        if (todayCompare.getTime() === selectedCompare.getTime()) {
                          return slotDate < now;
                        }
                        return false;
                      };

                      const disabled = isBooked || isPast();

                      return (
                        <button
                          key={time}
                          disabled={disabled}
                          onClick={() => handleTimeSelect(time)}
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No available time slots for this day</p>
                  </div>
                )}

                {bookedTimes.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    * Some time slots are already booked
                  </p>
                )}
              </div>
            )}

            {/* Empty state for date selection */}
            {selectedService && !selectedDate && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Please select a date</p>
              </div>
            )}
          </div>

          {/* Booking Summary - Always visible */}
          <div className="w-full lg:w-96">
            <div className="bg-blue-50 rounded-2xl shadow-md p-6 border flex flex-col gap-5 sticky top-6">

              <h3 className="font-semibold text-lg text-blue-700">
                Booking Summary
              </h3>

              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col">
                    {selectedService ? (
                      <>
                        <span className="font-medium">
                          {selectedService.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {selectedService.duration_minutes} minutes
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">
                        Select a service
                      </span>
                    )}

                    {selectedTime && selectedDate && (
                      <span className="text-sm text-gray-400 mt-1">
                        {selectedDate.toDateString()} • {selectedTime}
                      </span>
                    )}
                  </div>
                </div>

                {selectedService && (
                  <div className="font-semibold text-blue-700">
                    Rp {selectedService.price.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="h-px bg-blue-200" />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {selectedService ? `Rp ${selectedService.price.toLocaleString()}` : "Rp 0"}
                </span>
              </div>

              <Button
                disabled={!selectedService || !selectedTime || !selectedDate}
                className="mt-4 py-3"
                onClick={openBookingModal}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeBookingModal}
        className="max-w-[500px] p-6"
      >
        <div className="flex flex-col">
          <h5 className="mb-4 font-semibold text-gray-800 dark:text-white text-xl">
            Confirm Your Booking
          </h5>

          {/* Booking Details */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Service</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Date</span>
              <span className="font-medium">{selectedDate?.toDateString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Time</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-blue-700">
                Rp {selectedService?.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Customer Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleConfirmBooking(); }}>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Notes (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3}
                className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="Any special requests..."
              />
            </div>

            {bookingError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{bookingError}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mt-6 sm:justify-end">
              <Button 
                type="button" 
                onClick={closeBookingModal} 
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!customerName || !customerPhone || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

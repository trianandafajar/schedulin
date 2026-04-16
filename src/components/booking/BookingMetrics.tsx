"use client";
import React, { useMemo } from "react";
import { 
  startOfWeek, 
  startOfMonth, 
  isSameDay, 
  isWithinInterval, 
  parseISO, 
  subWeeks,
  subMonths,
  isYesterday
} from "date-fns";

interface Booking {
  id: string;
  status: string;
  slot?: {
    date: string;
  } | null;
  created_at: string;
}

interface BookingMetricsProps {
  bookings: Booking[];
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => {
  const trendUp = trend !== undefined && trend > 0;
  const trendDown = trend !== undefined && trend < 0;
  const trendDisplay = trend !== undefined ? `${Math.abs(trend).toFixed(1)}%` : "0%";
  
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-[#111111] dark:hover:shadow-[var(--color-brand-500)]/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {value}
          </h3>
          
          {trend !== undefined && (
            <div className="mt-4 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                trendUp 
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                  : trendDown 
                    ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" 
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
              }`}>
                {trendUp ? (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                ) : trendDown ? (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                ) : (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>
                )}
                {trendDisplay}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">vs last period </span>
            </div>
          )}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-600)] transition-colors duration-300 group-hover:bg-[var(--color-brand-500)] group-hover:text-white dark:bg-[var(--color-brand-500)]/10 dark:text-[var(--color-brand-400)] dark:group-hover:bg-[var(--color-brand-500)] dark:group-hover:text-white">
          {icon}
        </div>
      </div>
    </div>
  );
};

const BookingMetrics: React.FC<BookingMetricsProps> = ({ bookings }) => {
  const metrics = useMemo(() => {
    const today = new Date();
    
    const todayBookings = bookings.filter(b => b.slot?.date && isSameDay(parseISO(b.slot.date), today)).length;
    const yesterdayBookings = bookings.filter(b => b.slot?.date && isYesterday(parseISO(b.slot.date))).length;
    const todayTrend = yesterdayBookings === 0 ? (todayBookings > 0 ? 100 : 0) : ((todayBookings - yesterdayBookings) / yesterdayBookings) * 100;
    
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = new Date();
    const weeklyBookings = bookings.filter(b => b.slot?.date && isWithinInterval(parseISO(b.slot.date), { start: weekStart, end: weekEnd })).length;
    
    const lastWeekStart = subWeeks(weekStart, 1);
    const lastWeekEnd = subWeeks(weekEnd, 1);
    const lastWeekBookings = bookings.filter(b => b.slot?.date && isWithinInterval(parseISO(b.slot.date), { start: lastWeekStart, end: lastWeekEnd })).length;
    const weeklyTrend = lastWeekBookings === 0 ? (weeklyBookings > 0 ? 100 : 0) : ((weeklyBookings - lastWeekBookings) / lastWeekBookings) * 100;
    
    const monthStart = startOfMonth(today);
    const monthEnd = new Date();
    const monthlyBookings = bookings.filter(b => b.slot?.date && isWithinInterval(parseISO(b.slot.date), { start: monthStart, end: monthEnd })).length;
    
    const lastMonthStart = subMonths(monthStart, 1);
    const lastMonthEnd = subMonths(monthEnd, 1);
    const lastMonthBookings = bookings.filter(b => b.slot?.date && isWithinInterval(parseISO(b.slot.date), { start: lastMonthStart, end: lastMonthEnd })).length;
    const monthlyTrend = lastMonthBookings === 0 ? (monthlyBookings > 0 ? 100 : 0) : ((monthlyBookings - lastMonthBookings) / lastMonthBookings) * 100;

    return {
      today: { value: todayBookings, trend: todayTrend },
      weekly: { value: weeklyBookings, trend: weeklyTrend },
      monthly: { value: monthlyBookings, trend: monthlyTrend }
    };
  }, [bookings]);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <MetricCard
        title="Today's Bookings"
        value={metrics.today.value}
        trend={metrics.today.trend}
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
      />
      <MetricCard
        title="Weekly Bookings"
        value={metrics.weekly.value}
        trend={metrics.weekly.trend}
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
      />
      <MetricCard
        title="Monthly Bookings"
        value={metrics.monthly.value}
        trend={metrics.monthly.trend}
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
      />
    </div>
  );
};

export default BookingMetrics;
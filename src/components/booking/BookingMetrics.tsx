"use client";
import React, { useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { 
  startOfWeek, 
  startOfMonth, 
  isSameDay, 
  isWithinInterval, 
  parseISO, 
  subDays,
  subWeeks,
  subMonths,
  endOfWeek,
  endOfMonth,
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
  const trendUp = trend && trend > 0;
  const trendDown = trend && trend < 0;
  const trendDisplay = trend ? `${Math.abs(trend).toFixed(1)}%` : "0%";
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
          {trend !== undefined && (
            <p className={`mt-1 text-sm flex items-center gap-1 ${
              trendUp ? "text-green-500" : trendDown ? "text-red-500" : "text-gray-500"
            }`}>
              {trendUp ? "↑" : trendDown ? "↓" : "→"} {trendDisplay}
              <span className="text-gray-400 text-xs">vs last period</span>
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
          {icon}
        </div>
      </div>
    </div>
  );
};

const BookingMetrics: React.FC<BookingMetricsProps> = ({ bookings }) => {
  const metrics = useMemo(() => {
    const today = new Date();
    
    // 1. TODAY vs YESTERDAY
    const todayBookings = bookings.filter(b => {
      if (!b.slot?.date) return false;
      return isSameDay(parseISO(b.slot.date), today);
    }).length;
    
    const yesterdayBookings = bookings.filter(b => {
      if (!b.slot?.date) return false;
      return isYesterday(parseISO(b.slot.date));
    }).length;
    
    const todayTrend = yesterdayBookings === 0 
      ? (todayBookings > 0 ? 100 : 0)
      : ((todayBookings - yesterdayBookings) / yesterdayBookings) * 100;
    
    // 2. THIS WEEK vs LAST WEEK
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = new Date();
    
    const weeklyBookings = bookings.filter(b => {
      if (!b.slot?.date) return false;
      const date = parseISO(b.slot.date);
      return isWithinInterval(date, { start: weekStart, end: weekEnd });
    }).length;
    
    const lastWeekStart = subWeeks(weekStart, 1);
    const lastWeekEnd = subWeeks(weekEnd, 1);
    
    const lastWeekBookings = bookings.filter(b => {
      if (!b.slot?.date) return false;
      const date = parseISO(b.slot.date);
      return isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd });
    }).length;
    
    const weeklyTrend = lastWeekBookings === 0
      ? (weeklyBookings > 0 ? 100 : 0)
      : ((weeklyBookings - lastWeekBookings) / lastWeekBookings) * 100;
    
    // 3. THIS MONTH vs LAST MONTH
    const monthStart = startOfMonth(today);
    const monthEnd = new Date();
    
    const monthlyBookings = bookings.filter(b => {
      if (!b.slot?.date) return false;
      const date = parseISO(b.slot.date);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    }).length;
    
    const lastMonthStart = subMonths(monthStart, 1);
    const lastMonthEnd = subMonths(monthEnd, 1);
    
    const lastMonthBookings = bookings.filter(b => {
      if (!b.slot?.date) return false;
      const date = parseISO(b.slot.date);
      return isWithinInterval(date, { start: lastMonthStart, end: lastMonthEnd });
    }).length;
    
    const monthlyTrend = lastMonthBookings === 0
      ? (monthlyBookings > 0 ? 100 : 0)
      : ((monthlyBookings - lastMonthBookings) / lastMonthBookings) * 100;

    return {
      today: { value: todayBookings, trend: todayTrend },
      weekly: { value: weeklyBookings, trend: weeklyTrend },
      monthly: { value: monthlyBookings, trend: monthlyTrend }
    };
  }, [bookings]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricCard
        title="Today's Bookings"
        value={metrics.today.value}
        trend={metrics.today.trend}
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
      <MetricCard
        title="Weekly Bookings"
        value={metrics.weekly.value}
        trend={metrics.weekly.trend}
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7V3M16 7V3M3 7H21M5 19H19M5 5H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
      <MetricCard
        title="Monthly Bookings"
        value={metrics.monthly.value}
        trend={metrics.monthly.trend}
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9H21M9 21V9M15 21V9M5 9H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
    </div>
  );
};

export default BookingMetrics;
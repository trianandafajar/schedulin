'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/lib/supabase/client';
import { Check, Lock } from 'lucide-react';

type PlanType = 'starter' | 'medium' | 'business';

interface PlanContextType {
  plan: PlanType;
  loading: boolean;
  isFeatureEnabled: (featureId: string) => boolean;
  checkRestriction: (featureId: string, currentCount?: number) => { enabled: boolean; limit?: number; remaining?: number };
  showUpgradeModal: (featureName: string) => void;
  refreshPlan: () => Promise<void>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const supabase = createClient();

export const planLimits = {
  starter: {
    maxBookings: 10,
    maxServices: 5,
    maxHolidays: 5,
    dashboard: false,
    flexibleHolidays: false,
  },
  medium: {
    maxBookings: 200,
    maxServices: 15,
    maxHolidays: 999,
    dashboard: true,
    flexibleHolidays: true,
  },
  business: {
    maxBookings: 999999,
    maxServices: 999999,
    maxHolidays: 999999,
    dashboard: true,
    flexibleHolidays: true,
  }
};

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [plan, setPlan] = useState<PlanType>('starter');
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ show: boolean; featureName: string }>({ show: false, featureName: '' });

  const refreshPlan = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('users')
      .select('plan, subscription_end_date')
      .eq('id', user.id)
      .single();

    if (data) {
      let currentPlan = data.plan as PlanType;
      
      // Check if plan is expired
      if (currentPlan !== 'starter' && data.subscription_end_date) {
        const expiryDate = new Date(data.subscription_end_date);
        if (expiryDate < new Date()) {
          // Plan expired, downgrade automatically
          await supabase
            .from('users')
            .update({ plan: 'starter', subscription_end_date: null })
            .eq('id', user.id);
          currentPlan = 'starter';
        }
      }
      
      setPlan(currentPlan);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoaded && user) {
      refreshPlan();
    }
  }, [isLoaded, user]);

  const isFeatureEnabled = (featureId: string) => {
    const limits = planLimits[plan];
    switch (featureId) {
      case 'dashboard': return limits.dashboard;
      case 'flexibleHolidays': return limits.flexibleHolidays;
      default: return true;
    }
  };

  const checkRestriction = (featureId: string, currentCount: number = 0) => {
    const limits = planLimits[plan];
    if (featureId === 'bookings') {
      return { 
        enabled: currentCount < limits.maxBookings, 
        limit: limits.maxBookings,
        remaining: Math.max(0, limits.maxBookings - currentCount)
      };
    }
    if (featureId === 'services') {
      return { 
        enabled: currentCount < limits.maxServices, 
        limit: limits.maxServices,
        remaining: Math.max(0, limits.maxServices - currentCount)
      };
    }
    if (featureId === 'holidays') {
        return { 
          enabled: currentCount < limits.maxHolidays, 
          limit: limits.maxHolidays,
          remaining: Math.max(0, limits.maxHolidays - currentCount)
        };
      }
    return { enabled: true };
  };

  const showUpgradeModal = (featureName: string) => {
    setModalState({ show: true, featureName });
  };

  return (
    <PlanContext.Provider value={{ plan, loading, isFeatureEnabled, checkRestriction, showUpgradeModal, refreshPlan }}>
      {children}
      
      {/* Global Upgrade Modal */}
      {modalState.show && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-500/10 text-brand-500 rounded-xl flex items-center justify-center shrink-0">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upgrade Required</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This feature is locked on your current plan.
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              To use <strong>{modalState.featureName}</strong>, please upgrade your subscription from the <span className="font-bold text-brand-500 uppercase">{plan}</span> plan.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                    setModalState({ ...modalState, show: false });
                    window.location.href = '/billing';
                }}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/25 active:scale-95"
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setModalState({ ...modalState, show: false })}
                className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-bold transition-all hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

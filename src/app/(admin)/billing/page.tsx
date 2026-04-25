'use client';

import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useUser } from "@clerk/nextjs";
import { Check, Loader2 } from "lucide-react";
import { usePlan } from "@/context/PlanContext";
import supabase from "@/lib/supabase";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""; 

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    level: 0,
    monthlyPrice: 0,
    features: [
      'Public booking link (ON/OFF)',
      'Date & time selection',
      'Max 10 bookings / month',
      'Max 5 services',
      'Appointment settings',
      'Closed Days (max 5 days / month)',
    ],
  },
  {
    id: 'medium',
    name: 'Medium',
    level: 1,
    monthlyPrice: 10,
    features: [
      'Everything in Starter +',
      'Max 100–200 bookings / month',
      'Max 10–15 services',
      'Flexible Closed Days',
      'Appointment settings',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    level: 2,
    monthlyPrice: 19,
    features: [
      'Everything in Medium +',
      'Unlimited bookings',
      'Unlimited services',
      'Basic dashboard (booking stats)',
    ],
  },
];

export default function BillingPage() {
  const { user, isLoaded } = useUser();
  const { refreshPlan } = usePlan();
  const [currentPlan, setCurrentPlan] = useState('starter');
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');

  const currentPlanData = plans.find(p => p.id === currentPlan) || plans[0];

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserPlan();
    }
  }, [isLoaded, user]);

  const fetchUserPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user?.id)
        .single();

      if (data?.plan) {
        setCurrentPlan(data.plan);
      }
    } catch (err) {
      console.error("Error fetching plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (monthlyPrice: number) => {
    if (billingCycle === 'monthly') return monthlyPrice;
    return Math.floor(monthlyPrice * 12 * 0.9); // 10% discount for yearly
  };

  const handlePaymentSuccess = async (planId: string) => {
    try {
      const endDate = new Date();
      if (billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const { error } = await supabase
        .from('users')
        .update({ 
          plan: planId,
          subscription_end_date: endDate.toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      await refreshPlan();
      setCurrentPlan(planId);
      setNewPlanName(planId.charAt(0).toUpperCase() + planId.slice(1));
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error updating plan:", err);
      alert("Payment successful but failed to update plan in database. Please contact support.");
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
      <div className="p-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your plan and billing information.</p>
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
            >
              Yearly
              <span className="bg-brand-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">10% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = calculatePrice(plan.monthlyPrice);
            const isDowngrade = plan.level < currentPlanData.level;
            const isCurrent = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col ${isCurrent
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                  }`}
              >
                {isCurrent && (
                  <div className="absolute top-4 right-4 bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Current Plan
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">${price}</span>
                  <span className="text-gray-500 ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4 min-h-[120px]">
                  {isCurrent ? (
                    <div className="w-full py-3 px-4 bg-brand-500/10 text-brand-500 rounded-xl font-bold text-center border border-brand-500/20">
                      Active
                    </div>
                  ) : isDowngrade ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-xl font-bold cursor-not-allowed border border-gray-200 dark:border-gray-700"
                    >
                      Not Active
                    </button>
                  ) : plan.monthlyPrice > 0 ? (
                    <PayPalButtons
                      style={{ layout: "vertical", label: "subscribe", height: 45 }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: price.toString(),
                                currency_code: "USD"
                              },
                              description: `${plan.name} Plan (${billingCycle})`
                            },
                          ],
                          intent: "CAPTURE"
                        });
                      }}
                      onApprove={async (data, actions) => {
                        await actions.order?.capture();
                        handlePaymentSuccess(plan.id);
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => handlePaymentSuccess(plan.id)}
                      className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} strokeWidth={3} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade Successful!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Welcome to the <span className="font-bold text-brand-500">{newPlanName}</span> plan. Your new features are now active.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/25 active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </PayPalScriptProvider>
  );
}

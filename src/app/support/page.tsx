"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Check, Loader2, MessageSquare, AlertCircle, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

interface FAQItem {
  question: string;
  answer: string;
}

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General Support");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I configure my weekly operational hours?",
      answer: "Go to the Settings page in your dashboard, click on 'Opening Hours', and select the operating times for each day of the week. Our system validates time inputs automatically: you cannot set an end time earlier than your start time.",
    },
    {
      question: "Does the system automatically prevent booking overlaps?",
      answer: "Yes, absolutely! Schedullin performs real-time checks. Whenever an appointment slot is selected and confirmed, that specific period is blocked instantly in our database, making it completely unavailable for other clients.",
    },
    {
      question: "What features are offered by the AI Booking Assistant?",
      answer: "The 'asas Assistant' is a fully conversational chatbot designed for your public booking page. It answers client questions in natural language, queries your service menu, lists real-time slot availability, collects client contact info, and schedules appointments automatically.",
    },
    {
      question: "How do holidays and closed days affect my booking calendar?",
      answer: "Adding holidays under the settings page instantly blocks the entire day on your public booking calendar. Clients visiting your page won't be able to select these dates, preventing unexpected bookings when you are away.",
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubject("");
      setMessage("");
      setCategory("General Support");
    }, 1200);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-gray-100 font-sans flex flex-col justify-between transition-colors">
      {/* Premium Flat Header */}
      <header className="w-full bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-[#313131] py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <ThemeToggleButton />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow w-full">
        {/* Navigation back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="border border-gray-200 dark:border-[#313131] bg-white dark:bg-[#111111] p-8 md:p-12 rounded-3xl mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Help & Support
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
            Have questions or need technical help? Send a support ticket or read our frequently asked questions. No sign-in is required to submit a request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Support Ticket Card (3 Cols on Large Screens) */}
          <div className="lg:col-span-3 border border-gray-200 dark:border-[#313131] bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-2xl">
                <MessageSquare className="w-5 h-5 text-brand-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Create Support Ticket
              </h3>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-4 text-sm bg-white dark:bg-neutral-900 text-gray-800 dark:text-white border border-gray-200 dark:border-[#313131] rounded-xl outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                  >
                    <option>General Support</option>
                    <option>Billing & Subscription</option>
                    <option>Technical Issue</option>
                    <option>Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Can't sync my Google Calendar"
                    className="w-full h-11 px-4 text-sm bg-white dark:bg-neutral-900 text-gray-800 dark:text-white border border-gray-200 dark:border-[#313131] rounded-xl outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Details / Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your issue or question in detail..."
                    className="w-full p-4 text-sm bg-white dark:bg-neutral-900 text-gray-800 dark:text-white border border-gray-200 dark:border-[#313131] rounded-xl outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !subject.trim() || !message.trim()}
                  className="w-full h-11 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 dark:disabled:bg-neutral-800 disabled:text-gray-400 dark:disabled:text-gray-600 font-bold text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 px-4 flex flex-col items-center">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 border border-green-200 dark:border-green-800/40">
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Ticket Submitted Successfully!
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
                  Thank you for contacting support. We have received your query and our team will get back to you at your primary email within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 h-10 border border-gray-200 dark:border-[#313131] hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl transition-colors"
                >
                  Submit Another Ticket
                </button>
              </div>
            )}
          </div>

          {/* FAQ Area (2 Cols on Large Screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-gray-200 dark:border-[#313131] bg-white dark:bg-[#111111] rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-2xl">
                  <HelpCircle className="w-5 h-5 text-brand-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Support FAQs
                </h3>
              </div>

              {/* Accordion List */}
              <div className="divide-y divide-gray-100 dark:divide-[#313131]">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between text-left gap-4 group"
                      >
                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-brand-500 transition-colors">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-brand-500" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-l-2 border-brand-500 pl-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Notice */}
            <div className="border border-gray-200 dark:border-[#313131] bg-brand-50/40 dark:bg-brand-500/5 rounded-3xl p-5 flex gap-4 items-start">
              <AlertCircle className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-gray-800 dark:text-gray-200">
                  Operating Hours
                </h5>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                  Our support agents are active Monday to Friday, 9:00 AM to 5:00 PM EST. Tickets submitted outside hours will be addressed first thing next business day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Flat Footer */}
      <footer className="w-full bg-white dark:bg-[#111111] border-t border-gray-200 dark:border-[#313131] py-8 px-6 md:px-12 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Schedullin. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/privacy-policy" className="hover:text-brand-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/support" className="hover:text-brand-500 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
      <div className="fixed bottom-24 right-6 z-[9999]">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}

"use client";
import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar/Navbar';
import Footer from '@/components/Footer';
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';
import { ThemeProvider } from '@/context/ThemeContext';
import { useUser } from '@clerk/nextjs';
import { Mail, MessageSquare, HelpCircle, ChevronDown, CheckCircle } from 'lucide-react';
import Label from '@/components/form/Label';

export default function SupportPage() {
  const { isSignedIn } = useUser();
  const startLink = isSignedIn ? '/dashboard' : '/signin';

  const navItems = [
    { title: 'Why Maketime', href: '/#value' },
    { title: 'Features', href: '/#features' },
    { title: isSignedIn ? 'Dashboard' : 'Sign In', href: startLink, outlined: true },
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I set my Weekly Operating Hours?",
      a: "Navigate to your Dashboard, select 'Appointment Settings', and use the checkboxes next to each day to open or close that operating slot. Adjust the input times to control when clients are able to book appointments."
    },
    {
      q: "Can clients book overlapping times?",
      a: "No. Our scheduling engine automatically checks existing bookings, blocked times, and custom holidays to ensure slot availability is 100% accurate, preventing overlapping bookings."
    },
    {
      q: "How does the AI Assistant (asas Assistant) help me?",
      a: "Our AI booking assistant is loaded onto your public booking link. It can chat directly with your clients, answer service inquiries, suggest available slots, and schedule appointments without text typing!"
    },
    {
      q: "How are holidays managed on my calendar?",
      a: "You can add specific public holidays or custom off-days in the 'Holidays' tab in your settings. Once registered, those full dates are blocked instantly from public bookings."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && subject && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-outfit transition-colors duration-300">
        <Navbar items={navItems} />

        <main className="max-w-6xl mx-auto px-6 py-16 pt-28">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Help Center & Support
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">
              How can we help you?
            </h1>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
              Got a question about booking, calendars, or custom assistant integration? Browse our FAQs or send our dedicated support team a message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 transition-colors">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-brand-500" />
                Submit a Support Ticket
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
                Fill in the form below and we will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="p-6 bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ticket Submitted Successfully</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thank you! Your ticket has been recorded. Our team is already on it and will reply to your registered email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1f2937] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5 text-gray-700 dark:text-gray-300">Your Name</Label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="h-11 w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:ring-0 focus:outline-none focus:ring-brand-500/10"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 text-gray-700 dark:text-gray-300">Email Address</Label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                        className="h-11 w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:ring-0 focus:outline-none focus:ring-brand-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-1.5 text-gray-700 dark:text-gray-300">Subject</Label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="e.g. Schedule integration query"
                      className="h-11 w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:ring-0 focus:outline-none focus:ring-brand-500/10"
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 text-gray-700 dark:text-gray-300">Detailed Message</Label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:ring-0 focus:outline-none focus:ring-brand-500/10 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center h-12 rounded-xl bg-brand-500 hover:bg-brand-600 text-sm font-bold text-white transition-colors"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              )}
            </div>

            {/* FAQs Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 transition-colors">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-500" />
                  Frequently Asked Questions
                </h2>

                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = activeFaq === index;
                    return (
                      <div
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-800/60 pb-3 last:border-b-0 last:pb-0"
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : index)}
                          className="w-full flex items-center justify-between text-left py-2 font-semibold text-sm text-gray-800 dark:text-gray-200 hover:text-brand-500 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-500" : ""}`}
                          />
                        </button>
                        <div
                          className={`transition-all duration-200 overflow-hidden ${
                            isOpen ? "max-h-40 mt-1 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed pl-1">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Info Box */}
              <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/20 text-brand-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Direct Contact Details</h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Prefer direct email? You can drop a message at <strong className="text-brand-600 dark:text-brand-400">support@maketime.com</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </ThemeProvider>
  );
}

"use client";

import Link from "next/link";
import { Shield, Database, Cpu, Lock, Mail, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Shield className="w-5 h-5 text-brand-500" />,
      title: "1. Introduction",
      content:
        "Welcome to Schedullin. Your privacy is of paramount importance to us. This Privacy Policy describes how we collect, use, process, and disclose your information, including personal data, in conjunction with your access to and use of the Schedullin scheduling platform. By using our service, you agree to the collection and use of information in accordance with this policy.",
    },
    {
      icon: <Database className="w-5 h-5 text-brand-500" />,
      title: "2. Data We Collect",
      content:
        "We collect information to provide better services to our users. This includes account credentials (such as your name, email address, password, and phone number), business scheduling preferences, calendar integration access tokens (to synchronize your appointments), and public booking details submitted by customers who schedule appointments with you.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-brand-500" />,
      title: "3. How We Use Your Data",
      content:
        "Schedullin processes your information to operate, provide, improve, and customize our services. Primarily, we use your data to facilitate seamless appointment bookings, synchronize schedule availability across connected calendars, generate smart operational timings, coordinate chatbot booking instructions through our AI assistant, and send transactional email or SMS reminders to system participants.",
    },
    {
      icon: <Lock className="w-5 h-5 text-brand-500" />,
      title: "4. Security",
      content:
        "The security of your personal data is a top priority. We implement robust, industry-standard physical, technical, and administrative security measures to protect your information against unauthorized access, loss, destruction, or alteration. All database transfers are fully encrypted using Secure Socket Layer (SSL/TLS) protocols.",
    },
    {
      icon: <Mail className="w-5 h-5 text-brand-500" />,
      title: "5. Contacts",
      content:
        "If you have any questions, concerns, or requests regarding this Privacy Policy or how your personal information is managed, please reach out to our dedicated privacy support team directly at privacy@schedullin.com. We endeavor to respond to all inquiries within three business days.",
    },
  ];

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
              href="/support"
              className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
            >
              Support
            </Link>
            <ThemeToggleButton />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow">
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
            Last updated: May 18, 2026. This legal document governs the privacy practices of the Schedullin scheduling platform. Please read it carefully to understand our commitment to your security.
          </p>
        </div>

        {/* Content segments */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-[#313131] bg-white dark:bg-[#111111] p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-center shrink-0">
                {section.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
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

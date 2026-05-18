"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar/Navbar';
import Footer from '@/components/Footer';
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';
import { ThemeProvider } from '@/context/ThemeContext';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const { isSignedIn } = useUser();
  const startLink = isSignedIn ? '/dashboard' : '/signin';

  const navItems = [
    { title: 'Why Maketime', href: '/#value' },
    { title: 'Features', href: '/#features' },
    { title: isSignedIn ? 'Dashboard' : 'Sign In', href: startLink, outlined: true },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-outfit transition-colors duration-300">
        <Navbar items={navItems} />
        
        <main className="max-w-4xl mx-auto px-6 py-16 pt-28">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Legal Information
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: May 18, 2026
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-10 text-base leading-relaxed">
            <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Welcome to Maketime. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our booking services.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                By accessing or using our services, you agree to the collection, storage, use, and disclosure of your personal information as described in this Policy.
              </p>
            </section>

            <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                2. Information We Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> Includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting, and device details.</li>
                <li><strong>Usage Data:</strong> Includes information about how you use our website, services, and booking pages.</li>
              </ul>
            </section>

            <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                3. How We Use Your Data
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>To register you as a new customer and manage your appointments.</li>
                <li>To provide the conversational AI scheduling assistant capabilities (asas Assistant).</li>
                <li>To manage our relationship with you including notifying you about changes to our terms or privacy policy.</li>
                <li>To administer and protect our business and this website.</li>
              </ul>
            </section>

            <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                4. Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                5. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact our support team.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-sm font-bold text-white transition-colors"
              >
                Go to Support Page
              </Link>
            </section>
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

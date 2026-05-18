"use client";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-[#0c111d] font-outfit transition-colors duration-300">
      {/* Subtle grid pattern for visual depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] dark:opacity-20" />

      <div className="relative z-10 w-full max-w-lg text-center bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-12 shadow-sm transition-all">
        {/* Animated illustration container */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-brand-50 dark:bg-brand-950/30 text-brand-500 transition-transform duration-300 hover:scale-105">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400 mb-4">
          404 Error
        </span>

        {/* Headings */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed mb-8">
          We can’t seem to find the page you are looking for. It may have been moved, deleted, or never existed in the first place.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.history.back();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1f2937] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-sm font-bold text-white shadow-sm transition-all cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-500 z-10">
        &copy; {new Date().getFullYear()} Maketime. All rights reserved.
      </p>
    </div>
  );
}

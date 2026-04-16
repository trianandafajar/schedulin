import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-[#111111] sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-[#111111] sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full relative overflow-hidden hidden lg:flex items-center justify-center bg-gray-50/50 dark:bg-black/20">
            {/* Minimalist Brand Accents */}
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,var(--color-brand-500)_0%,transparent_50%)]" />
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#2F72FB_0%,transparent_50%)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-10 max-w-lg p-8">
              <div className="relative group">
                <Image
                  width={420}
                  height={420}
                  src="/auth.svg"
                  alt="Auth Illustration"
                  className="relative z-10 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  Maketime for <span className="text-brand-500">Appointment</span> <span className="text-[#2F72FB]">Teams</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

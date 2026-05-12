// MUST be first - initializes React for styled-components SSR
import '@/lib/styled-components-init';

import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PlanProvider } from '@/context/PlanContext';
import { ClerkProvider } from '@clerk/nextjs';
import { NewsletterModalContextProvider } from './contexts/newsletter-modal.context';
import StyledComponentsRegistry from '@/lib/registry';
import { Metadata } from 'next';
import ChatWidget from '@/components/chat/ChatWidget';

export const metadata: Metadata = {
  title: {
    template: '%s | Schedullin',
    default: 'Schedullin | Appointment Booking on Autopilot',
  },
  description: 'Schedullin is a professional appointment booking platform for clinics, salons, and consultants.',
};


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} dark:bg-[#0c0c0c]`} suppressHydrationWarning>
          <StyledComponentsRegistry>

            <NewsletterModalContextProvider>
            <ThemeProvider>
              <PlanProvider>
                <SidebarProvider>
                  <main>
                  {children}
                  </main>
                </SidebarProvider>
                <ChatWidget />
              </PlanProvider>
            </ThemeProvider>
            </NewsletterModalContextProvider>
          </StyledComponentsRegistry>
            
        </body>
      </html>
    </ClerkProvider>
  );
}

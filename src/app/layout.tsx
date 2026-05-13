// MUST be first - initializes React for styled-components SSR
import '@/lib/styled-components-init';

import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ClerkProvider } from '@clerk/nextjs';
import { NewsletterModalContextProvider } from './contexts/newsletter-modal.context';
import StyledComponentsRegistry from '@/lib/registry';

import { PlanProvider } from '@/context/PlanContext';
import ChatWidget from '@/components/chat/ChatWidget';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "Maketime",
  description: "Platform booking dan maketime modern",
  icons: {
    icon: "./favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300`}>
          <StyledComponentsRegistry>

            <NewsletterModalContextProvider>
              <ThemeProvider>
                <PlanProvider>
                  <SidebarProvider>
                    {children}
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

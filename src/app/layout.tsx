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
        <body className={`${outfit.className} dark:bg-gray-900`}>
          <StyledComponentsRegistry>

            <NewsletterModalContextProvider>
            <ThemeProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </ThemeProvider>
            </NewsletterModalContextProvider>
          </StyledComponentsRegistry>
            
        </body>
      </html>
    </ClerkProvider>
  );
}

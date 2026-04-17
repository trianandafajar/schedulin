'use client';

import styled from 'styled-components';
import React from 'react';
import Hero from '../../../views/HomePage/Hero';
import BasicSection from '@/components/BasicSection';
import Cta from '../../../views/HomePage/Cta';
import FeaturesGallery from '../../../views/HomePage/FeaturesGallery';
import Features from '../../../views/HomePage/Features';
import Footer from '@/components/Footer';
import RichText from '@/components/RichText';
import Navbar from '@/components/landing/Navbar/Navbar';
import { SingleNavItem } from '@/components/landing/Navbar/NavbarLinks';
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';
import { ThemeProvider } from "@/context/ThemeContext";
import { useUser } from "@clerk/nextjs";

export default function HomepageContent() {
  const { isSignedIn, user } = useUser();

  const userName = user?.firstName || "Guest";
  const startLink = isSignedIn ? "/dashboard" : "/signin";



  const navItems: SingleNavItem[] = [
    { title: "Features", href: "#features" },
    { title: "Benefits", href: "#benefits" },
    { title: "Solutions", href: "#solutions" },
    { title: isSignedIn ? userName : "Sign In", href: startLink, outlined: true },
  ];

  return (
    <>
      <ThemeProvider>
        <Navbar items={navItems} />
        <HomepageWrapper>
          <WhiteBackgroundContainer>
            <Hero />
            {/* <Partners /> */}
          <div id="benefits">
            <BasicSection imageUrl="/demo-illustration-1.svg" title="Appointment booking on autopilot." overTitle="SaaS Appointment Booking">
              <p>
                Accept bookings 24/7 with an online page that syncs instantly with your team calendar. Clients choose open slots and get automatic
                confirmation.
              </p>
              <p>
                Fast setup for clinics, salons, consultants, and other service businesses.
              </p>
            </BasicSection>
            <BasicSection imageUrl="/demo-illustration-2.svg" title="Fewer no-shows, cleaner schedules." overTitle="Operational Efficiency" reversed>
              <p>
                Reduce manual admin work with automated reminders, booking deposits, and real-time updates for every team member.
              </p>
              <CustomRichText>
                <ul>
                  <li>Automatic reminders by email or WhatsApp</li>
                  <li>Two-way Google Calendar sync</li>
                  <li>Booking analytics for service performance</li>
                </ul>
              </CustomRichText>
            </BasicSection>
          </div>
          </WhiteBackgroundContainer>
          <Cta />
          <div id="features">
            <FeaturesGallery />
          </div>
          <div id="solutions">
            <Features />
          </div>
        </HomepageWrapper>
        <Footer />
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </ThemeProvider>
    </>
  );
}

const HomepageWrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  padding-top: 2rem;

  & > :last-child {
    margin-bottom: 5rem;
  }
`;

const WhiteBackgroundContainer = styled.div`
  background: rgb(var(--secondBackground));

  & > :last-child {
    padding-bottom: 2rem;
  }
`;

const CustomRichText = styled(RichText)`

text-align: justify
`;
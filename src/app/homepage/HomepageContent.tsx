'use client';

import styled from 'styled-components';
import React from 'react';
import Hero from '../../../views/HomePage/Hero';
import BasicSection from '@/components/BasicSection';
import Link from 'next/link';
import Cta from '../../../views/HomePage/Cta';
import FeaturesGallery from '../../../views/HomePage/FeaturesGallery';
import Features from '../../../views/HomePage/Features';
import Testimonials from '../../../views/HomePage/Testimonials';
import ScrollableBlogPosts from '../../../views/HomePage/ScrollableBlogPosts';
import Footer from '@/components/Footer';
import Navbar from '@/components/landing/Navbar/Navbar';
import { SingleNavItem } from '@/components/landing/Navbar/NavbarLinks';

export default function HomepageContent() {
  const navItems: SingleNavItem[] = [
    { title: 'Features', href: '/features' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Contact', href: '/contact' },
    { title: 'Start Free', href: '/signup', outlined: true },
  ];

  return (
    <>
      <Navbar items={navItems} />
      <HomepageWrapper>
        <WhiteBackgroundContainer>
          <Hero />
          {/* <Partners /> */}
          <BasicSection imageUrl="/demo-illustration-1.svg" title="Appointment booking on autopilot." overTitle="SaaS Appointment Booking">
            <p>
              Accept bookings 24/7 with an online page that syncs instantly with your team calendar. Clients choose open slots and get automatic
              confirmation.
            </p>
            <p>
              Fast setup for clinics, salons, consultants, and other service businesses.
              <Link href="/help-center"> See the setup guide.</Link>
            </p>
          </BasicSection>
          <BasicSection imageUrl="/demo-illustration-2.svg" title="Fewer no-shows, cleaner schedules." overTitle="Operational Efficiency" reversed>
            <p>
              Reduce manual admin work with automated reminders, booking deposits, and real-time updates for every team member.
            </p>
            <ul>
              <li>Automatic reminders by email or WhatsApp</li>
              <li>Two-way Google Calendar sync</li>
              <li>Booking analytics for service performance</li>
            </ul>
          </BasicSection>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer>
          <Cta />
          <FeaturesGallery />
          <Features />
          <Testimonials />
          <ScrollableBlogPosts />
        </DarkerBackgroundContainer>
      </HomepageWrapper>
      <Footer/>
    </>
  );
}

const HomepageWrapper = styled.div`
  padding-top: 2rem;

  & > :last-child {
    margin-bottom: 5rem;
  }
`;

const DarkerBackgroundContainer = styled.div`
  background: rgb(var(--background));

  & > *:not(:first-child) {
    margin-top: 5rem;
  }
`;

const WhiteBackgroundContainer = styled.div`
  background: rgb(var(--secondBackground));

  & > :last-child {
    padding-bottom: 5rem;
  }

  & > *:not(:first-child) {
    margin-top: 5rem;
  }
`;

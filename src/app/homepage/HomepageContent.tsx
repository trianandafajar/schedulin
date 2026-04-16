'use client';

import React from 'react';
import styled from 'styled-components';
import Navbar from '@/components/landing/Navbar/Navbar';
import { SingleNavItem } from '@/components/landing/Navbar/NavbarLinks';
import Hero from '../../../views/HomePage/Hero';
import FeaturesGallery from '../../../views/HomePage/FeaturesGallery';
import Features from '../../../views/HomePage/Features';
import Cta from '../../../views/HomePage/Cta';
import Footer from '@/components/Footer';
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';
import { ThemeProvider } from '@/context/ThemeContext';
import { useUser } from '@clerk/nextjs';
import Container from '@/components/Container';

const VALUE_POINTS = [
  {
    title: 'Faster booking decisions',
    body: 'Clients see only truly available time blocks, so they book quickly without extra chat or admin follow-up.',
  },
  {
    title: 'Fewer no-shows',
    body: 'Automated confirmations and reminders keep attendance high while your team spends less time chasing updates.',
  },
  {
    title: 'One clear calendar view',
    body: 'Service, staff, and appointment data stay in sync so every day feels predictable and easier to run.',
  },
];

export default function HomepageContent() {
  const { isSignedIn } = useUser();
  const startLink = isSignedIn ? '/dashboard' : '/signin';

  const navItems: SingleNavItem[] = [
    { title: 'Why Maketime', href: '#value' },
    { title: 'Features', href: '#features' },
    { title: isSignedIn ? 'Dashboard' : 'Sign In', href: startLink, outlined: true },
  ];

  return (
    <ThemeProvider>
      <LandingRoot>
        <Navbar items={navItems} />
        <MainArea>
          <Hero />
          <ValueSection id="value" aria-label="Maketime value proposition">
            <SectionEyebrow>Editorial workflow for service teams</SectionEyebrow>
            <SectionTitle>Built to make your calendar feel calm and controllable.</SectionTitle>
            <ValueGrid>
              {VALUE_POINTS.map((point) => (
                <ValueCard key={point.title}>
                  <ValueTitle>{point.title}</ValueTitle>
                  <ValueBody>{point.body}</ValueBody>
                </ValueCard>
              ))}
            </ValueGrid>
          </ValueSection>
          <FeaturesGallery />
          <Features />
          <Cta />
        </MainArea>
        <Footer />
        <ThemeToggleWrap>
          <ThemeTogglerTwo />
        </ThemeToggleWrap>
      </LandingRoot>
    </ThemeProvider>
  );
}

const LandingRoot = styled.div`
  --mk-bg: #eef1f8;
  --mk-surface: #f7f8fb;
  --mk-surface-elevated: #ffffff;
  --mk-text: #152038;
  --mk-text-muted: #52607e;
  --mk-border: #d7dce7;
  --mk-accent: #1f4fbf;
  --mk-shadow-soft: 0 28px 50px rgba(28, 40, 71, 0.1);
  --mk-shadow-card: 0 12px 30px rgba(25, 42, 79, 0.08);

  background:
    radial-gradient(circle at 8% 7%, rgba(31, 79, 191, 0.1), transparent 34%),
    radial-gradient(circle at 90% 0%, rgba(30, 106, 146, 0.12), transparent 28%),
    linear-gradient(180deg, #f9faff 0%, var(--mk-bg) 45%, #f4f7ff 100%);
  color: var(--mk-text);

    .dark & {
    background: #000000 !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }

  @keyframes mkFadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MainArea = styled.main`
  margin: 0 auto;
  max-width: 1280px;
  padding: 1.1rem 0 4.5rem;
  
`;

const ValueSection = styled(Container)`
  margin-top: 2.8rem;
  animation: mkFadeUp 0.58s ease-out both;
`;

const SectionEyebrow = styled.p`
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-brand-600);
  margin: 0;
`;

const SectionTitle = styled.h2`
  margin: 0.7rem 0 0;
  max-width: 52rem;
  font-size: clamp(1.7rem, 2.8vw, 2.6rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--mk-text);

  .dark & {
    color: var(--color-white)  !important;
  }
`;

const ValueGrid = styled.div`
  margin-top: 1.65rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.article`
  border-radius: 1rem;
  border: 1px solid var(--mk-border);
  background: color-mix(in srgb, var(--mk-surface-elevated) 88%, #ffffff 12%);
  box-shadow: var(--mk-shadow-card);
  padding: 1.1rem 1rem 1.2rem;
  animation: mkFadeUp 0.58s ease-out both;

  .dark & {
    background: var(--color-black) !important;
    color: var(--color-white);
    border-color: rgba(255, 255, 255, 0.1) !important;
  }

  &:nth-child(2) {
    animation-delay: 0.05s;
  }

  &:nth-child(3) {
    animation-delay: 0.1s;
  }


`;

const ValueTitle = styled.h3`
  margin: 0;
  font-size: 1.03rem;
  letter-spacing: -0.01em;
`;

const ValueBody = styled.p`
  margin: 0.62rem 0 0;
  line-height: 1.6;
  font-size: 0.93rem;
  color: var(--mk-text-muted);
`;

const ThemeToggleWrap = styled.div`
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 50;

  @media (max-width: 639px) {
    display: none;
  }
`;

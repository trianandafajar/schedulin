'use client';
import { media } from '@/app/utils/media';
import AutofitGrid from '@/components/AutofitGrid';
import Container from '@/components/Container';
import OverTitle from '@/components/OverTitle';
import NextImage from 'next/image';
import React from 'react';
import styled, { keyframes } from 'styled-components';

const FEATURES = [
  {
    imageUrl: '/grid-icons/asset-1.svg',
    title: 'Smart Availability Rules',
    description: 'Set business hours, buffers, breaks, and blackout dates with flexible scheduling rules.',
  },
  {
    imageUrl: '/grid-icons/asset-2.svg',
    title: 'Online Booking Page',
    description: 'Share one branded link so clients can book in real time from any device.',
  },
  {
    imageUrl: '/grid-icons/asset-3.svg',
    title: 'Automated Reminders',
    description: 'Send email or WhatsApp reminders automatically before every appointment.',
  },
  {
    imageUrl: '/grid-icons/asset-4.svg',
    title: 'Calendar Sync',
    description: 'Connect Google Calendar to avoid double booking across your team.',
  },
  {
    imageUrl: '/grid-icons/asset-5.svg',
    title: 'Reschedule Flow',
    description: 'Let clients reschedule from the confirmation link without contacting support.',
  },
  {
    imageUrl: '/grid-icons/asset-6.svg',
    title: 'Deposit & Payments',
    description: 'Collect deposits at checkout to lower no-shows and protect your time.',
  },
];

export default function Features() {
  return (
    <FeaturesSection>
      <SectionHead>
        <CustomOverTitle>Everything you need</CustomOverTitle>
        <Headline>Nothing you don&apos;t.</Headline>
        <Subline>
          Robust features built specifically for clinics, salons, and modern consultants.
        </Subline>
      </SectionHead>
      <CustomAutofitGrid>
        {FEATURES.map((singleFeature, idx) => (
          <FeatureCard key={singleFeature.title + idx} style={{ animationDelay: `${idx * 0.05}s` }}>
            <IconBox>
              <NextImage src={singleFeature.imageUrl} width={32} height={32} alt={singleFeature.title} />
            </IconBox>
            <CardBody>
              <CardTitle>{singleFeature.title}</CardTitle>
              <CardDescription>{singleFeature.description}</CardDescription>
            </CardBody>
          </FeatureCard>
        ))}
      </CustomAutofitGrid>
    </FeaturesSection>
  );
}

/* ─── Keyframes ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Layout ─── */
const FeaturesSection = styled(Container)`
  padding-top: 5rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;

  ${media('<=tablet')} {
    padding-top: 3rem;
    padding-bottom: 3rem;
    gap: 3rem;
  }
`;

const SectionHead = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  animation: ${fadeUp} 0.7s ease both;
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 0.75rem;
`;

const Headline = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin-bottom: 1rem;

  .dark & {
    color: white;
  }

  ${media('<=tablet')} {
    font-size: 2.1rem;
  }
`;

const Subline = styled.p`
  font-size: 1.05rem;
  color: #64748b;
  line-height: 1.6;

  .dark & {
    color: #94a3b8;
  }
`;

const CustomAutofitGrid = styled(AutofitGrid)`
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  ${media('<=tablet')} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  ${media('<=phone')} {
    grid-template-columns: 1fr;
  }
`;

/* ─── Feature Card ─── */
const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.75rem;
  background: white;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${fadeUp} 0.6s ease both;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px -10px rgba(20, 115, 250, 0.15);
    border-color: rgba(20, 115, 250, 0.18);
  }

  .dark & {
    background: #0f172a;
    border-color: #1e293b;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    &:hover {
      border-color: rgba(255, 255, 255, 0.15);
      background: #131d36;
    }
  }
`;

const IconBox = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 115, 250, 0.06);
  border-radius: 1rem;
  flex-shrink: 0;

  .dark & {
    background: rgba(255, 255, 255, 0.04);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardTitle = styled.h4`
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;

  .dark & {
    color: white;
  }
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #64748b;

  .dark & {
    color: #94a3b8;
  }
`;

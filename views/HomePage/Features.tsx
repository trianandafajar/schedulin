import { media } from '@/utils/media';
import Container from '@/components/Container';
import NextImage from 'next/image';
import React from 'react';
import styled from 'styled-components';

const FEATURES = [
  {
    imageUrl: '/grid-icons/asset-4.svg',
    title: 'Availability logic',
    description: 'Set hours, breaks, and blocked dates with precise controls that match your daily operations.',
  },
  {
    imageUrl: '/grid-icons/asset-2.svg',
    title: 'Branded booking page',
    description: 'Share one polished booking page that is ready for clients on desktop and mobile.',
  },
  {
    imageUrl: '/grid-icons/asset-3.svg',
    title: 'Automated reminders',
    description: 'Keep clients informed with timed confirmation and reminder messages before each appointment.',
  },
  {
    imageUrl: '/grid-icons/asset-7.svg',
    title: 'Calendar sync',
    description: 'Connect existing calendars to keep conflicts low and team schedules aligned.',
  },
  {
    imageUrl: '/grid-icons/asset-5.svg',
    title: 'Reschedule flow',
    description: 'Offer flexible rebooking while keeping your schedule rules and team capacity protected.',
  },
  {
    imageUrl: '/grid-icons/asset-1.svg',
    title: 'Performance analytics',
    description: 'Track attendance trends and service demand to make better planning decisions every week.',
  },
];


export default function Features() {
  return (
    <FeatureSection id="features">
      <HeadingWrap>
        <Eyebrow>Editorial workflow for service teams</Eyebrow>
        <Title>Built to make your calendar feel calm and controllable.</Title>
      </HeadingWrap>
      <Grid>
        {FEATURES.map((feature, index) => (
          <Card key={feature.title} style={{ animationDelay: `${index * 0.05}s` }}>
            <IconWrap>
              <NextImage src={feature.imageUrl} width={44} height={44} alt={feature.title} />
            </IconWrap>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </Card>
        ))}
      </Grid>
    </FeatureSection>
  );
}

const FeatureSection = styled(Container)`
  margin-top: 4.5rem;
  margin-bottom: 4.5rem;
`;

const HeadingWrap = styled.div`
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: var(--color-brand-600);
  font-size: 0.9rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
`;

const Title = styled.h2`
  margin: 0.85rem 0 0;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  
  .dark & {
    color: var(--color-white);
  }
`;

const Grid = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;

  ${media('<=tablet')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media('<=phone')} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Card = styled.article`
  border-radius: 1rem;
  border: 1px solid var(--color-gray-200);
  background: var(--mk-surface, #ffffff);
  padding: 2.2rem 2rem;
  animation: mkFadeFeature 0.5s ease-out both;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

  &:hover {
    transform: translateY(-8px);
    border-color: var(--color-brand-500);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  }

  .dark & {
    background: var(--color-black) !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    
    &:hover {
      background: #0a0a0a !important;
      border-color: var(--color-brand-500) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
    }
  }

  @keyframes mkFadeFeature {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const IconWrap = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1.25rem;
  border: 1px solid var(--color-brand-100);
  background: var(--color-brand-50);
  display: grid;
  place-items: center;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  .dark & {
    background: #0a0a0a;
    border-color: rgba(255, 255, 255, 0.08);
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #101828;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;

  .dark & {
    color: var(--color-white);
  }
`;

const CardDescription = styled.p`
  margin: 0.75rem 0 0;
  color: #475467;
  line-height: 1.6;
  font-size: 1rem;

  .dark & {
    color: var(--color-gray-400);
  }
`;


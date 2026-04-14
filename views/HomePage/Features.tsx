import { media } from '@/utils/media';
import Container from '@/components/Container';
import NextImage from 'next/image';
import React from 'react';
import styled from 'styled-components';

const FEATURES = [
  {
    imageUrl: '/grid-icons/asset-1.svg',
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
    imageUrl: '/grid-icons/asset-4.svg',
    title: 'Calendar sync',
    description: 'Connect existing calendars to keep conflicts low and team schedules aligned.',
  },
  {
    imageUrl: '/grid-icons/asset-5.svg',
    title: 'Reschedule flow',
    description: 'Offer flexible rebooking while keeping your schedule rules and team capacity protected.',
  },
  {
    imageUrl: '/grid-icons/asset-9.svg',
    title: 'Performance analytics',
    description: 'Track attendance trends and service demand to make better planning decisions every week.',
  },
];

export default function Features() {
  return (
    <FeatureSection id="features">
      <HeadingWrap>
        <Eyebrow>Feature set</Eyebrow>
        <Title>The essentials for modern appointment operations.</Title>
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
  margin-top: 3.1rem;
`;

const HeadingWrap = styled.div`
  text-align: center;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: var(--mk-accent, #1f4fbf);
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

const Title = styled.h2`
  margin: 0.66rem 0 0;
  font-size: clamp(1.7rem, 2.7vw, 2.35rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
`;

const Grid = styled.div`
  margin-top: 1.6rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;

  ${media('<=tablet')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media('<=phone')} {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  border-radius: 1rem;
  border: 1px solid var(--mk-border, #d7dce7);
  background: color-mix(in srgb, #ffffff 90%, #f7f8fb 10%);
  box-shadow: var(--mk-shadow-card, 0 12px 30px rgba(25, 42, 79, 0.08));
  padding: 1rem;
  animation: mkFadeFeature 0.5s ease-out both;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 34px rgba(18, 42, 92, 0.14);
  }

  @keyframes mkFadeFeature {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const IconWrap = styled.div`
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 0.75rem;
  border: 1px solid #dce4f5;
  background: #f8fbff;
  display: grid;
  place-items: center;
`;

const CardTitle = styled.h3`
  margin: 0.9rem 0 0;
  color: #122341;
  font-size: 1.02rem;
  letter-spacing: -0.01em;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0 0;
  color: #556580;
  line-height: 1.6;
  font-size: 0.9rem;
`;

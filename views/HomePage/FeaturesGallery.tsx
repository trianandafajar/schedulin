'use client';

import { media } from '@/utils/media';
import Container from '@/components/Container';
import NextImage from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';

const TABS = [
  {
    title: 'Live booking surface',
    description:
      'Publish one link and let customers choose only true availability from your service calendar.',
    imageUrl: '/demo-illustration-1.svg',
  },
  {
    title: 'Reminder automation',
    description:
      'Reduce no-shows with timed confirmations and reminders that run without manual follow-up.',
    imageUrl: '/demo-illustration-2.svg',
  },
  {
    title: 'Team-wide clarity',
    description:
      'Keep each staff calendar aligned to avoid conflicts and protect your day from overbooking.',
    imageUrl: '/demo-illustration-3.svg',
  },
];

export default function FeaturesGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTab = TABS[currentIndex];

  return (
    <Wrap aria-label="Feature proof section">
      <Head>
        <Eyebrow>Feature proof</Eyebrow>
        <Title>From booking request to attendance, every step stays connected.</Title>
      </Head>
      <Body>
        <Tabs role="tablist" aria-label="Feature highlights">
          {TABS.map((tab, idx) => {
            const active = idx === currentIndex;
            return (
              <TabButton
                key={tab.title}
                type="button"
                role="tab"
                aria-selected={active}
                $active={active}
                onClick={() => setCurrentIndex(idx)}
              >
                <TabTitle>{tab.title}</TabTitle>
                <TabDescription>{tab.description}</TabDescription>
              </TabButton>
            );
          })}
        </Tabs>
        <VisualPane>
          <NextImage src={currentTab.imageUrl} alt={currentTab.title} fill style={{ objectFit: 'cover' }} priority />
        </VisualPane>
      </Body>
    </Wrap>
  );
}

const Wrap = styled(Container)`
  margin-top: 3.2rem;
  animation: mkFadeProof 0.58s ease-out both;

  @keyframes mkFadeProof {
    from {
      opacity: 0;
      transform: translateY(9px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Head = styled.div`
  text-align: center;
`;

const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--mk-accent, #1f4fbf);
  font-weight: 600;
`;

const Title = styled.h2`
  margin: 0.7rem auto 0;
  max-width: 46rem;
  font-size: clamp(1.7rem, 2.8vw, 2.4rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
`;

const Body = styled.div`
  margin-top: 1.6rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.06fr);
  gap: 1rem;

  ${media('<=desktop')} {
    grid-template-columns: 1fr;
  }
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  text-align: left;
  border-radius: 1rem;
  border: 1px solid ${(p) => (p.$active ? '#a7bde9' : 'var(--mk-border, #d7dce7)')};
  background: ${(p) => (p.$active ? '#f5f8ff' : 'rgba(255, 255, 255, 0.84)')};
  padding: 1rem 1rem 1.05rem;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: #a7bde9;
  }
`;

const TabTitle = styled.h3`
  margin: 0;
  font-size: 1.02rem;
  letter-spacing: -0.01em;
  color: #132344;
`;

const TabDescription = styled.p`
  margin: 0.55rem 0 0;
  line-height: 1.6;
  color: #516280;
  font-size: 0.9rem;
`;

const VisualPane = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 24rem;
  border-radius: 1.1rem;
  border: 1px solid var(--mk-border, #d7dce7);
  background: #ffffff;
  box-shadow: var(--mk-shadow-card, 0 12px 30px rgba(25, 42, 79, 0.08));

  ${media('<=desktop')} {
    min-height: 20rem;
  }
`;

'use client';
import { media } from '@/app/utils/media';
import Collapse from '@/components/Collapse';
import Container from '@/components/Container';
import OverTitle from '@/components/OverTitle';
import NextImage from 'next/image';
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const TABS = [
  {
    title: 'Booking page that fills itself',
    description:
      'Publish one link and let clients choose open slots based on your live team availability.',
    imageUrl: '/demo-illustration-3.svg',
  },
  {
    title: 'Automations that reduce no-shows',
    description:
      'Automatically send confirmations, reminders, and follow-ups so appointments stay on track.',
    imageUrl: '/demo-illustration-4.svg',
  },
  {
    title: 'Team scheduling without conflicts',
    description:
      'Sync calendars across staff and locations to stop double booking and scheduling mistakes.',
    imageUrl: '/demo-illustration-5.svg',
  },
];

export default function FeaturesGallery() {
  const [currentTabIdx, setCurrentTabIdx] = useState(0);

  const imagesMarkup = TABS.map((singleTab, idx) => {
    const isActive = idx === currentTabIdx;
    return (
      <ImageContainer key={singleTab.title} $isActive={isActive}>
        <GlowOverlay />
        <NextImage
          src={singleTab.imageUrl}
          alt={singleTab.title}
          fill
          style={{ objectFit: 'contain' }}
          priority={idx === 0}
        />
      </ImageContainer>
    );
  });

  const tabsMarkup = TABS.map((singleTab, idx) => {
    const isActive = idx === currentTabIdx;

    return (
      <Tab $isActive={isActive} key={idx} onClick={() => setCurrentTabIdx(idx)}>
        <Indicator $isActive={isActive} />
        <TabHeader>
          <TabTitle $isActive={isActive}>{singleTab.title}</TabTitle>
        </TabHeader>
        <Collapse isOpen={isActive} duration={300}>
          <TabDescription>{singleTab.description}</TabDescription>
        </Collapse>
      </Tab>
    );
  });

  return (
    <FeaturesGalleryWrapper>
      <ContentHeader>
        <CustomOverTitle>Features</CustomOverTitle>
        <Headline>Everything you need to run appointment operations.</Headline>
      </ContentHeader>
      <GalleryLayout>
        <TabsList>{tabsMarkup}</TabsList>
        <ImageDisplay>{imagesMarkup}</ImageDisplay>
      </GalleryLayout>
    </FeaturesGalleryWrapper>
  );
}

/* ─── Keyframes ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.1); opacity: 0.2; }
`;

/* ─── Layout ─── */
const FeaturesGalleryWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  padding-top: 5rem;
  padding-bottom: 5rem;

  ${media('<=tablet')} {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
`;

const ContentHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
  animation: ${fadeUp} 0.7s ease both;
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 1rem;
`;

const Headline = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: #0f172a;

  .dark & {
    color: white;
  }

  ${media('<=tablet')} {
    font-size: 2.2rem;
  }

  ${media('<=phone')} {
    font-size: 1.8rem;
  }
`;

const GalleryLayout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4rem;

  ${media('<=desktop')} {
    flex-direction: column;
    gap: 3rem;
  }
`;

/* ─── Tabs ─── */
const TabsList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

const Tab = styled.div<{ $isActive: boolean }>`
  position: relative;
  padding: 1.5rem 2rem;
  background: ${(p) => (p.$isActive ? 'white' : 'transparent')};
  border-radius: 1.25rem;
  border: 1px solid ${(p) => (p.$isActive ? '#e2e8f0' : 'transparent')};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${(p) => (p.$isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)' : 'none')};

  .dark & {
    background: ${(p) => (p.$isActive ? '#0f172a' : 'transparent')};
    border-color: ${(p) => (p.$isActive ? '#1e293b' : 'transparent')};
  }

  &:hover {
    background: ${(p) => (!p.$isActive ? 'rgba(20, 115, 250, 0.04)' : 'white')};
    .dark &:hover {
      background: ${(p) => (!p.$isActive ? 'rgba(255, 255, 255, 0.02)' : '#0f172a')};
    }
  }
`;

const Indicator = styled.div<{ $isActive: boolean }>`
  position: absolute;
  left: 0;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 4px;
  background: #1473fa;
  border-radius: 0 4px 4px 0;
  opacity: ${(p) => (p.$isActive ? 1 : 0)};
  transform: scaleY(${(p) => (p.$isActive ? 1 : 0.5)});
  transition: all 0.3s ease;
`;

const TabHeader = styled.div`
  display: flex;
  align-items: center;
`;

const TabTitle = styled.h4<{ $isActive: boolean }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(p) => (p.$isActive ? '#0f172a' : '#64748b')};
  transition: color 0.3s ease;

  .dark & {
    color: ${(p) => (p.$isActive ? 'white' : '#94a3b8')};
  }
`;

const TabDescription = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #64748b;
  opacity: 0.9;

  .dark & {
    color: #cbd5e1;
  }
`;

/* ─── Images ─── */
const ImageDisplay = styled.div`
  flex: 1.2;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 2.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  animation: ${fadeUp} 0.8s 0.2s ease both;

  .dark & {
    background: #0f172a;
    border-color: #1e293b;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  ${media('<=phone')} {
    padding: 1rem;
  }
`;

const ImageContainer = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 100%;
  display: ${(p) => (p.$isActive ? 'block' : 'none')};
  aspect-ratio: 16 / 10;
  transition: all 0.5s ease;

  & > div {
    position: absolute;
    inset: 0;
  }
`;

const GlowOverlay = styled.div`
  position: absolute;
  inset: -10%;
  background: radial-gradient(circle, rgba(20, 115, 250, 0.15) 0%, transparent 70%);
  animation: ${pulseGlow} 6s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
`;

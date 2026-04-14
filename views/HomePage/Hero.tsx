'use client';

import { media } from '@/utils/media';
import Container from '@/components/Container';
import HeroIllustration from '@/components/HeroIllustation';
import Button from '@/components/ui/button/Button';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import styled from 'styled-components';

export default function Hero() {
  const { isSignedIn } = useUser();
  const primaryHref = isSignedIn ? '/dashboard' : '/signup';

  return (
    <HeroWrapper aria-label="Maketime hero section">
      <TextColumn>
        <Eyebrow>Maketime for appointment teams</Eyebrow>
        <Heading>
          Make every booking feel
          <span> intentional, fast, and clear.</span>
        </Heading>
        <Description>
          Maketime helps service businesses run clean schedules with automated booking, reminders, and team-wide availability control.
        </Description>
        <ActionRow>
          <Link href={primaryHref}>
            <Button className="!rounded-full !bg-brand-500 !px-8 !py-4 !text-sm !font-bold !tracking-wide hover:!bg-brand-600 hover:!scale-105 transition-all duration-300 shadow-lg shadow-brand-500/20" type="button">
              Start with Maketime
            </Button>
          </Link>
          <Link href="#features">
            <Button className="!rounded-full !bg-white dark:!bg-black !px-8 !py-4 !text-sm !font-bold !tracking-wide !text-gray-900 dark:!text-white ring-1 ring-gray-200 dark:ring-white/20 hover:!bg-gray-50 dark:hover:!bg-gray-900 transition-all duration-300" type="button">
              Explore features
            </Button>
          </Link>
        </ActionRow>
        <Microcopy>No credit card required. Launch-ready in minutes.</Microcopy>
      </TextColumn>
      <VisualColumn aria-hidden="true">
        <VisualFrame>
          <HeroIllustration />
        </VisualFrame>
      </VisualColumn>
    </HeroWrapper>
  );
}

const HeroWrapper = styled(Container)`
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: center;
  padding-top: 1.4rem;
  animation: mkHeroFade 0.58s ease-out both;

  @keyframes mkHeroFade {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${media('<=desktop')} {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }
`;

const TextColumn = styled.div`
  max-width: 38rem;

  ${media('<=desktop')} {
    max-width: 100%;
    text-align: center;
  }
`;

const Eyebrow = styled.p`
  margin: 0;
  color: var(--color-brand-600);
  letter-spacing: 0.14em;
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 700;
`;

const Heading = styled.h1`
  margin: 0.85rem 0 0;
  font-size: clamp(2rem, 4.4vw, 3.9rem);
  letter-spacing: -0.03em;
  line-height: 1.02;
  color: var(--mk-text, #152038);

  .dark & {
    color: var(--color-white);
  }

  span {
    color: var(--color-brand-600);
    display: inline-block;
    position: relative;
  }
`;

const Description = styled.p`
  margin: 1rem 0 0;
  color: var(--mk-text-muted, #52607e);
  line-height: 1.72;
  font-size: 1.01rem;
  max-width: 34rem;

  .dark & {
    color: var(--color-gray-400);
  }

  ${media('<=desktop')} {
    max-width: 100%;
  }
`;

const ActionRow = styled.div`
  margin-top: 1.55rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;

  ${media('<=desktop')} {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const Microcopy = styled.p`
  margin: 0.85rem 0 0;
  color: #667693;
  font-size: 0.84rem;
  letter-spacing: 0.01em;
  
  .dark & {
    color: var(--color-gray-500);
  }
`;

const VisualColumn = styled.div`
  display: flex;
  justify-content: flex-end;

  ${media('<=desktop')} {
    justify-content: center;
  }
`;

const VisualFrame = styled.div`
  width: min(100%, 48rem);
  border-radius: 1.5rem;
  border: 1px solid var(--color-gray-200);
  background: var(--mk-surface, #ffffff);
  padding: 0.5rem;
  overflow: hidden;
  position: relative;
  
  .dark & {
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 100%;
    height: auto;
    display: block;
    position: relative;
    z-index: 1;
  }
`;

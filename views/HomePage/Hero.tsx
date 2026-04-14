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
    <HeroWrapper aria-label="maketime hero section">
      <TextColumn>
        <Eyebrow>maketime for appointment teams</Eyebrow>
        <Heading>
          Make every booking feel
          <span> intentional, fast, and clear.</span>
        </Heading>
        <Description>
          maketime helps service businesses run clean schedules with automated booking, reminders, and team-wide availability control.
        </Description>
        <ActionRow>
          <Link href={primaryHref}>
            <Button className="!rounded-full !bg-[#1f4fbf] !px-6 !py-3 !text-xs !font-semibold !tracking-[0.01em] hover:!bg-[#16388a]" type="button">
              Start with maketime
            </Button>
          </Link>
          <Link href="#features">
            <Button className="!rounded-full !bg-white !px-6 !py-3 !text-xs !font-semibold !tracking-[0.01em] !text-[#1f3154] ring-1 ring-[#cad3e7] hover:!bg-[#f5f8ff]" type="button">
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
  color: var(--mk-accent, #1f4fbf);
  letter-spacing: 0.14em;
  font-size: 0.76rem;
  text-transform: uppercase;
  font-weight: 600;
`;

const Heading = styled.h1`
  margin: 0.85rem 0 0;
  font-size: clamp(2rem, 4.4vw, 3.9rem);
  letter-spacing: -0.03em;
  line-height: 1.02;
  color: var(--mk-text, #152038);

  span {
    color: #2a63ca;
  }
`;

const Description = styled.p`
  margin: 1rem 0 0;
  color: var(--mk-text-muted, #52607e);
  line-height: 1.72;
  font-size: 1.01rem;
  max-width: 34rem;

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
`;

const VisualColumn = styled.div`
  display: flex;
  justify-content: flex-end;

  ${media('<=desktop')} {
    justify-content: center;
  }
`;

const VisualFrame = styled.div`
  width: min(100%, 42rem);
  border-radius: 1.15rem;
  border: 1px solid rgba(27, 44, 79, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(249, 252, 255, 0.9) 100%);
  box-shadow: var(--mk-shadow-soft, 0 28px 50px rgba(28, 40, 71, 0.1));
  padding: 1rem 1rem 0.4rem;

  svg {
    width: 100%;
    height: auto;
    display: block;
  }
`;

'use client';

import { media } from '@/utils/media';
import Container from '@/components/Container';
import Button from '@/components/ui/button/Button';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export default function Cta() {
  const { isSignedIn } = useUser();
  const startLink = isSignedIn ? '/dashboard' : '/signup';

  return (
    <CtaSection>
      <CtaPanel>
        <Eyebrow>Final call</Eyebrow>
        <Title>Bring structure to every booking with maketime.</Title>
        <Description>
          Launch your public booking flow, automate reminders, and keep your team calendar coherent from day one.
        </Description>
        <Actions>
          <Link href={startLink}>
            <Button className="!rounded-full !bg-[#1f4fbf] !px-6 !py-3 !text-xs !font-semibold hover:!bg-[#173a8f]" type="button">
              Start free today
            </Button>
          </Link>
          <Link href="/signin">
            <Button className="!rounded-full !bg-transparent !px-6 !py-3 !text-xs !font-semibold !text-[#24406b] ring-1 ring-[#cad3e7] hover:!bg-white" type="button">
              Sign in
            </Button>
          </Link>
        </Actions>
      </CtaPanel>
    </CtaSection>
  );
}

const CtaSection = styled(Container)`
  margin-top: 3.2rem;
  animation: mkFadeCta 0.58s ease-out both;

  @keyframes mkFadeCta {
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

const CtaPanel = styled.section`
  border-radius: 1.2rem;
  border: 1px solid #b9c9eb;
  background: linear-gradient(135deg, #e8f0ff 0%, #edf5ff 55%, #e9f6fa 100%);
  box-shadow: var(--mk-shadow-soft, 0 28px 50px rgba(28, 40, 71, 0.1));
  padding: 2.1rem 2rem;
  text-align: center;

  ${media('<=phone')} {
    padding: 1.7rem 1.2rem;
  }
`;

const Eyebrow = styled.p`
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  color: #1f4fbf;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Title = styled.h2`
  margin: 0.7rem auto 0;
  max-width: 42rem;
  font-size: clamp(1.65rem, 2.7vw, 2.35rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #10203e;
`;

const Description = styled.p`
  margin: 0.82rem auto 0;
  max-width: 37rem;
  color: #4f607c;
  line-height: 1.62;
  font-size: 0.95rem;
`;

const Actions = styled.div`
  margin-top: 1.35rem;
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

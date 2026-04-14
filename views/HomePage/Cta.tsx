'use client';

import { media } from '@/utils/media';
import Container from '@/components/Container';
import Button from '@/components/ui/button/Button';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import styled from 'styled-components';

export default function Cta() {
  const { isSignedIn } = useUser();
  const startLink = isSignedIn ? '/dashboard' : '/signup';

  return (
    <CtaSection>
      <CtaPanel>
        <Eyebrow>Final call</Eyebrow>
        <Title>Bring structure to every booking with Maketime.</Title>
        <Description>
          Launch your public booking flow, automate reminders, and keep your team calendar coherent from day one.
        </Description>
        <Actions>
          <Link href={startLink}>
            <Button className="!rounded-full !bg-brand-500 !px-8 !py-4 !text-sm !font-bold hover:!bg-brand-600 hover:!scale-105 transition-all duration-300 shadow-md shadow-brand-500/20" type="button">
              Start free today
            </Button>
          </Link>
          <Link href="/signin">
            <Button className="!rounded-full !bg-white dark:!bg-black !px-8 !py-4 !text-sm !font-bold !text-[#2F72FB] dark:!text-white ring-1 ring-gray-200 dark:ring-white/20 hover:!bg-gray-50 dark:hover:!bg-gray-900 transition-all duration-300" type="button">
              Sign in
            </Button>
          </Link>
        </Actions>
      </CtaPanel>
    </CtaSection>
  );
}

const CtaSection = styled(Container)`
  margin-top: 4.5rem;
  margin-bottom: 4.5rem;
  animation: mkFadeCta 0.65s cubic-bezier(0.165, 0.84, 0.44, 1) both;

  @keyframes mkFadeCta {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CtaPanel = styled.section`
  border-radius: 2rem;
  border: 1px solid var(--color-gray-200);
  background: var(--mk-surface, #ffffff);
  position: relative;
  overflow: hidden;
  padding: 4rem 2rem;
  text-align: center;
  
  .dark & {
    border-color: rgba(255, 255, 255, 0.1);
  }

  ${media('<=phone')} {
    padding: 2.5rem 1.5rem;
  }
`;

const Eyebrow = styled.p`
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-brand-600);
  font-size: 0.85rem;
  font-weight: 700;
`;

const Title = styled.h2`
  margin: 0.85rem auto 0;
  max-width: 44rem;
  font-size: clamp(1.8rem, 3.2vw, 2.75rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #101828;

  .dark & {
    color: var(--color-white);
  }
`;

const Description = styled.p`
  margin: 1.1rem auto 0;
  max-width: 38rem;
  color: #475467;
  line-height: 1.65;
  font-size: 1.05rem;

  .dark & {
    color: var(--color-gray-400);
  }
`;

const Actions = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

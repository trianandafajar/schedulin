'use client';
import { media } from '@/app/utils/media';
import Button from '@/components/ui/button/Button';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import styled from 'styled-components';

export default function Cta() {
  const { isSignedIn } = useUser();
  const startLink = isSignedIn ? '/dashboard' : '/signup';

  return (
    <CtaSection>
      <Inner>
        <Headline>Ready to simplify your scheduling?</Headline>
        <SubText>
          Join thousands of businesses that trust Schedulin to manage their bookings 24/7. 
          Start your free trial today.
        </SubText>
        <Actions>
          <Link href={startLink} passHref>
            <PrimaryBtn>
              Get Started for Free <span>&rarr;</span>
            </PrimaryBtn>
          </Link>
        </Actions>
      </Inner>
    </CtaSection>
  );
}

const CtaSection = styled.section`
  background: white;
  color: #0f172a;
  border-radius: 1.5rem;
  margin: 4rem auto;
  max-width: 1100px;
  padding: 5rem 2rem;
  text-align: center;
  border: 1px solid rgba(20, 115, 250, 0.15);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);

  .dark & {
    background: #0f172a;
    color: white;
    border-color: rgba(255, 255, 255, 0.1);
  }

  ${media('<=tablet')} {
    margin: 2rem 1rem;
    padding: 3.5rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
`;

const Headline = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #0f172a;

  .dark & {
    color: white;
  }

  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const SubText = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
  line-height: 1.6;
`;

const Actions = styled.div`
  margin-top: 1rem;
`;

const PrimaryBtn = styled(Button)`
  background: #1473fa;
  color: white;
  font-weight: 700;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 0.75rem;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    background: #084ebf;
    transform: translateY(-2px);
    color: white;
  }

  span {
    margin-left: 0.5rem;
  }
`;

const TrustNote = styled.p`
  font-size: 0.85rem;
  opacity: 0.6;
`;

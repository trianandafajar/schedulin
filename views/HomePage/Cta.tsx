"use client"
import { media } from '@/app/utils/media';
import ButtonGroup from '@/components/ButtonGroup';
import Container from '@/components/Container';
import OverTitle from '@/components/OverTitle';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';


export default function Cta() {
  return (
    <CtaWrapper>
      <Container>
        <Stack>
          <OverTitle>Lorem ipsum dolor sit amet</OverTitle>
          <SectionTitle>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus delectus?</SectionTitle>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda beatae accusamus deleniti nihil quas tempora numquam, vitae
            culpa.
          </Description>
          <ButtonGroup>
            <Link href="/signup">
              <Button>
                Start Now <span>&rarr;</span>
              </Button>
            </Link>
            <Link href="/signin">
              <OutlinedButton>
                Register <span>&rarr;</span>
              </OutlinedButton>
            </Link>
          </ButtonGroup>
        </Stack>
      </Container>
    </CtaWrapper>
  );
}

const Description = styled.div`
  font-size: 1.8rem;
  color: rgba(var(--textSecondary), 0.8);
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12.5rem 0;
  color: rgb(var(--textSecondary));
  text-align: center;
  align-items: center;
  justify-content: center;

  & > *:not(:first-child) {
    max-width: 80%;
    margin-top: 4rem;
  }

  ${media('<=tablet')} {
    text-align: center;

    & > *:not(:first-child) {
      max-width: 100%;
      margin-top: 2rem;
    }
  }
`;

const OutlinedButton = styled(Button)`
  border: 1px solid rgb(var(--textSecondary));
  color: rgb(var(--textSecondary));
`;

const CtaWrapper = styled.div`
  background: rgb(var(--secondary));
`;

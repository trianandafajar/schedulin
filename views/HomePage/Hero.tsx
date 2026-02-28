import { useNewsletterModalContext } from '@/app/contexts/newsletter-modal.context';
import { media } from '@/app/utils/media';
import ButtonGroup from '@/components/ButtonGroup';
import Container from '@/components/Container';
import HeroIllustration from '@/components/HeroIllustation';
import OverTitle from '@/components/OverTitle';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import styled from 'styled-components';


export default function Hero() {
  const { setIsModalOpened } = useNewsletterModalContext();

  return (
    <HeroWrapper>
      <Contents>
        <CustomOverTitle>appointment booking software for service teams</CustomOverTitle>
        <Heading>Run your bookings on autopilot.</Heading>
        <Description>
          Let clients book available slots online, send automatic reminders, and keep your team calendar in sync without manual back-and-forth.
        </Description>
        <CustomButtonGroup>
          <Button onClick={() => setIsModalOpened(true)}>
            Book a Demo <span>&rarr;</span>
          </Button>
          <Link href="/signup">
            <Button>
              Start Free <span>&rarr;</span>
            </Button>
          </Link>
        </CustomButtonGroup>
      </Contents>
      <ImageContainer>
        <HeroIllustration />
      </ImageContainer>
    </HeroWrapper>
  );
}

const HeroWrapper = styled(Container)`
  display: flex;
  padding-top: 3rem;

  ${media('<=desktop')} {
    padding-top: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

const Contents = styled.div`
  flex: 1;
  max-width: 60rem;

  ${media('<=desktop')} {
    max-width: 100%;
  }
`;

const CustomButtonGroup = styled(ButtonGroup)`
  margin-top: 2.5rem;
`;

const ImageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-start;

  svg {
    max-width: 45rem;
  }

  ${media('<=desktop')} {
    margin-top: 2rem;
    justify-content: center;
    svg {
      max-width: 80%;
    }
  }
`;

const Description = styled.p`
  font-size: 1.5rem;
  opacity: 0.8;
  line-height: 1.5;

  ${media('<=desktop')} {
    font-size: 1.4rem;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 2rem;
`;

const Heading = styled.h1`
  font-size: 4.6rem;
  font-weight: bold;
  line-height: 1.15;
  margin-bottom: 2rem;
  letter-spacing: -0.03em;

  ${media('<=tablet')} {
    font-size: 3.2rem;
    margin-bottom: 1.5rem;
  }
`;

'use client';
import { useNewsletterModalContext } from '@/app/contexts/newsletter-modal.context';
import { media } from '@/app/utils/media';
import ButtonGroup from '@/components/ButtonGroup';
import Container from '@/components/Container';
import OverTitle from '@/components/OverTitle';
import Button from '@/components/ui/button/Button';
import { useUser } from '@clerk/nextjs';
import styled, { keyframes } from 'styled-components';

export default function Hero() {
  const { isSignedIn } = useUser();

  const handleGetStartedClick = () => {
    if (isSignedIn) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/signup';
    }
  };

  const { setIsModalOpened } = useNewsletterModalContext();

  return (
    <HeroWrapper>
      <Contents>
        <CustomOverTitle>appointment booking software</CustomOverTitle>
        <Heading>
          Run your bookings on autopilot.
        </Heading>
        <Description>
          Let clients book available slots online, send automatic reminders, and keep your team calendar in sync without manual back-and-forth.
        </Description>
        <CustomButtonGroup>
          <Button onClick={handleGetStartedClick}>
            Start Free <span>&rarr;</span>
          </Button>
          {/* <Link href="/signin">
            <Button variant="outline">
              Sign In <span>&rarr;</span>
            </Button>
          </Link> */}
        </CustomButtonGroup>
      </Contents>

      <IllustrationContainer>
        <IllustrationWrapper>
          <HeroSVG />
        </IllustrationWrapper>
      </IllustrationContainer>
    </HeroWrapper>
  );
}

/* ─── Floating animation keyframes ─── */
const floatA = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;
const floatB = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-7px); }
`;
const floatC = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-13px); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

/* ─── Styled Components ─── */
const HeroWrapper = styled(Container)`
  display: flex;
  align-items: center;
  padding-top: 4rem;
  padding-bottom: 2rem;
  gap: 4rem;

  ${media('<=desktop')} {
    padding-top: 2rem;
    flex-direction: column-reverse;
    align-items: center;
    gap: 3rem;
  }
`;

const Contents = styled.div`
  flex: 1;
  max-width: 56rem;
  animation: ${slideIn} 0.6s ease both;

  ${media('<=desktop')} {
    max-width: 100%;
    text-align: center;
  }
`;

const GradientSpan = styled.span`
  background: linear-gradient(135deg, #1473fa 0%, #5b9cf6 50%, #1473fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% auto;
`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  letter-spacing: -0.04em;

  .dark & {
    color: white;
  }

  ${media('<=tablet')} {
    font-size: 2.2rem;
  }

  ${media('<=phone')} {
    font-size: 1.85rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  opacity: 0.75;
  line-height: 1.7;
  max-width: 42rem;

  .dark & {
    color: #cdd5e0;
  }

  ${media('<=desktop')} {
    font-size: 1rem;
    margin: 0 auto;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  /* Global OverTitle is now blue */
`;

const CustomButtonGroup = styled(ButtonGroup)`
  margin-top: 2.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  ${media('<=desktop')} {
    align-items: center;
  }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 2rem;
  background: #1473fa;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(20, 115, 250, 0.4);
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;

  &:hover {
    background: #0e5fd4;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(20, 115, 250, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ArrowSpan = styled.span`
  font-size: 1.1rem;
  transition: transform 0.2s;

  ${PrimaryButton}:hover & {
    transform: translateX(4px);
  }
`;

const TrustLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.6;

  .dark & {
    color: #cdd5e0;
  }
`;

const TrustDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 2s ease-in-out infinite;
  flex-shrink: 0;
`;

const TrustBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;

  ${media('<=desktop')} {
    justify-content: center;
  }
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(20, 115, 250, 0.07);
  border: 1px solid rgba(20, 115, 250, 0.15);
  font-size: 0.82rem;

  .dark & {
    background: rgba(20, 115, 250, 0.12);
    border-color: rgba(20, 115, 250, 0.25);
    color: #cdd5e0;
  }
`;

const BadgeIcon = styled.span`
  font-size: 0.85rem;
`;

const BadgeText = styled.span`
  opacity: 0.8;

  strong {
    opacity: 1;
    color: #1473fa;
  }
`;

const BadgeDivider = styled.div`
  width: 1px;
  height: 16px;
  background: rgba(20, 115, 250, 0.2);
`;

const IllustrationContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  ${media('<=desktop')} {
    justify-content: center;
    width: 100%;
  }
`;

const IllustrationWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 560px;

  ${media('<=desktop')} {
    max-width: 480px;
  }

  ${media('<=phone')} {
    max-width: 340px;
  }
`;

/* ─── New hero illustration as inline SVG React component ─── */
function HeroSVG() {
  return (
    <SVGRoot viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background blobs */}
      <ellipse cx="320" cy="260" rx="200" ry="160" fill="#1473fa" fillOpacity="0.07" />
      <ellipse cx="420" cy="160" rx="110" ry="90" fill="#1473fa" fillOpacity="0.05" />
      <ellipse cx="100" cy="320" rx="80" ry="60" fill="#1473fa" fillOpacity="0.05" />

      {/* ── Main calendar card ── */}
      <CalendarCard x="80" y="60" width="260" height="220" rx="18" />

      {/* Calendar header */}
      <rect x="80" y="60" width="260" height="48" rx="18" fill="#1473fa" />
      <text x="116" y="91" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui">April 2026</text>
      {/* Chevrons */}
      <text x="295" y="91" fill="white" fontSize="16" fontFamily="system-ui" opacity="0.8">›</text>
      <text x="95" y="91" fill="white" fontSize="16" fontFamily="system-ui" opacity="0.8">‹</text>

      {/* Day labels */}
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
        <text key={i} x={100 + i * 34} y={130} fill="#64748b" fontSize="11" fontFamily="system-ui" fontWeight="600">{d}</text>
      ))}

      {/* Calendar grid – days */}
      {[
        { d: '1', x: 100, y: 155, available: false, today: false },
        { d: '2', x: 134, y: 155, available: true, today: false },
        { d: '3', x: 168, y: 155, available: false, today: false },
        { d: '4', x: 202, y: 155, available: true, today: false },
        { d: '5', x: 236, y: 155, available: false, today: true },
        { d: '6', x: 270, y: 155, available: true, today: false },
        { d: '7', x: 304, y: 155, available: false, today: false },
        { d: '8', x: 100, y: 187, available: false, today: false },
        { d: '9', x: 134, y: 187, available: true, today: false },
        { d: '10', x: 168, y: 187, available: true, today: false },
        { d: '11', x: 202, y: 187, available: false, today: false },
        { d: '12', x: 236, y: 187, available: true, today: false },
        { d: '13', x: 270, y: 187, available: false, today: false },
        { d: '14', x: 304, y: 187, available: true, today: false },
        { d: '15', x: 100, y: 219, available: false, today: false },
        { d: '16', x: 134, y: 219, available: true, today: false },
        { d: '17', x: 168, y: 219, available: true, today: false },
        { d: '18', x: 202, y: 219, available: false, today: false },
        { d: '19', x: 236, y: 219, available: true, today: false },
        { d: '20', x: 270, y: 219, available: false, today: false },
        { d: '21', x: 304, y: 219, available: false, today: false },
      ].map(({ d, x, y, available, today }) => (
        <g key={d}>
          {today && <circle cx={x + 6} cy={y - 5} r="13" fill="#1473fa" fillOpacity="0.12" />}
          {available && <circle cx={x + 6} cy={y - 5} r="4" fill="#22c55e" opacity="0.85" transform="translate(14, 0)" />}
          <text x={x} y={y}
            fill={today ? '#1473fa' : '#374151'}
            fontSize="11" fontWeight={today ? '700' : '500'}
            fontFamily="system-ui"
            className="dark-text"
          >{d}</text>
        </g>
      ))}

      {/* ── Booking confirmation card (floating top-right) ── */}
      <FloatA>
        <rect x="310" y="50" width="210" height="90" rx="14" fill="white" filter="url(#shadow)" />
        <rect x="310" y="50" width="210" height="90" rx="14" fill="white" />
        <rect x="310" y="50" width="210" height="90" rx="14" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="336" cy="80" r="16" fill="#1473fa" fillOpacity="0.12" />
        <text x="329" y="85" fontSize="14" fontFamily="system-ui">📅</text>
        <text x="362" y="76" fill="#1e293b" fontSize="11" fontWeight="700" fontFamily="system-ui">Booking Confirmed!</text>
        <text x="362" y="92" fill="#64748b" fontSize="10" fontFamily="system-ui">Sarah K. — Apr 19, 2:00 PM</text>
        <rect x="362" y="103" width="64" height="18" rx="5" fill="#22c55e" fillOpacity="0.15" />
        <text x="372" y="116" fill="#16a34a" fontSize="9" fontWeight="700" fontFamily="system-ui">✓ Confirmed</text>
      </FloatA>


      {/* Defs */}
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
        </filter>
      </defs>
    </SVGRoot>
  );
}

/* SVG styled wrapper that applies dark mode text overrides */
const SVGRoot = styled.svg`
  width: 100%;
  height: auto;
  overflow: visible;

  .dark-text {
    fill: #374151;
  }

  .dark & .dark-text {
    fill: #cbd5e1;
  }
`;

/* Floating animation wrappers (SVG foreign-object trick via styled g) */
const CalendarCard = styled.rect`
  fill: white;
  stroke: #e2e8f0;
  stroke-width: 1;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.09));

  .dark & {
    fill: #1e293b;
    stroke: #334155;
  }
`;

const FloatA = styled.g`
  animation: ${floatA} 4s ease-in-out infinite;

  rect {
    .dark & {
      fill: #1e293b !important;
      stroke: #334155 !important;
    }
  }
  text {
    .dark &[fill='#1e293b'] {
      fill: #e2e8f0 !important;
    }
    .dark &[fill='#64748b'] {
      fill: #94a3b8 !important;
    }
  }
`;

const FloatB = styled.g`
  animation: ${floatB} 5s ease-in-out infinite;

  rect {
    .dark & {
      fill: #1e293b !important;
      stroke: #334155 !important;
    }
  }
`;

const FloatC = styled.g`
  animation: ${floatC} 6s ease-in-out infinite;

  rect {
    .dark & {
      fill: #1e293b !important;
      stroke: #334155 !important;
    }
  }
`;

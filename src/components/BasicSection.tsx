'use client';
import NextImage from 'next/image';
import React, { PropsWithChildren } from 'react';
import styled, { keyframes } from 'styled-components';
import Container from './Container';
import OverTitle from './OverTitle';
import RichText from './RichText';
import { media } from '@/app/utils/media';

export interface BasicSectionProps {
  imageUrl: string;
  title: string;
  overTitle: string;
  reversed?: boolean;
}

export default function BasicSection({
  imageUrl,
  title,
  overTitle,
  reversed,
  children,
}: PropsWithChildren<BasicSectionProps>) {
  return (
    <SectionOuter $reversed={reversed}>
      <AccentBar />
      <Inner $reversed={reversed}>
        <ImageSide>
          <ImageFrame>
            <GlowRing />
            <ImageInner>
              <NextImage src={imageUrl} alt={title} fill objectFit="contain" />
            </ImageInner>
            <DecorDot $top="10%" $left="6%"  $size="9px"  $color="rgba(20,115,250,0.4)" $delay="0s" />
            <DecorDot $top="80%" $left="90%" $size="7px"  $color="rgba(34,197,94,0.5)"  $delay="1s" />
            <DecorDot $top="90%" $left="10%" $size="6px"  $color="rgba(99,102,241,0.4)" $delay="0.5s" />
          </ImageFrame>
        </ImageSide>

        <ContentSide $reversed={reversed}>
          <CustomOverTitle>{overTitle}</CustomOverTitle>
          <Title>{title}</Title>
          <StyledRichText>{children}</StyledRichText>
        </ContentSide>
      </Inner>
    </SectionOuter>
  );
}

/* ─── Keyframes ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 0.9; transform: scale(1.08); }
`;
const dotFloat = keyframes`
  0%, 100% { transform: scale(1);   opacity: 0.8; }
  50%       { transform: scale(1.7); opacity: 0.35; }
`;

/* ─── Section shell ─── */
const SectionOuter = styled.section<{ $reversed?: boolean }>`
  position: relative;
  margin: 0;
  padding: 5rem 0;
  overflow: hidden;

  /* alternating background for visual rhythm */
  background: ${(p) =>
    p.$reversed
      ? 'linear-gradient(135deg, rgba(20,115,250,0.04) 0%, rgba(99,102,241,0.03) 100%)'
      : 'transparent'};

  .dark & {
    background: ${(p) =>
      p.$reversed
        ? 'linear-gradient(135deg, rgba(20,115,250,0.07) 0%, rgba(99,102,241,0.04) 100%)'
        : 'transparent'};
  }

  ${media('<=phone')} {
    padding: 3rem 0;
  }
`;

/* Top accent line for the reversed (dark-tinted) sections */
const AccentBar = styled.div`
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(20, 115, 250, 0.1) 30%,
    rgba(99, 102, 241, 0.1) 70%,
    transparent
  );
`;

const Inner = styled(Container)<{ $reversed?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: ${(p) => (p.$reversed ? 'row-reverse' : 'row')};
  gap: 5rem;

  ${media('<=desktop')} {
    gap: 3rem;
  }

  ${media('<=phone')} {
    flex-direction: column;
    gap: 2.5rem;
  }
`;

/* ─── Image ─── */
const ImageSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;

  &::before {
    content: '';
    display: block;
    padding-top: calc((9 / 16) * 100%);
  }
`;

const GlowRing = styled.div`
  position: absolute;
  inset: 0%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(20, 115, 250, 0.13) 0%,
    rgba(99, 102, 241, 0.07) 45%,
    transparent 70%
  );
  animation: ${glowPulse} 5s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
`;

const ImageInner = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  img {
    object-fit: contain !important;
  }
`;

const DecorDot = styled.span<{
  $top: string;
  $left: string;
  $size: string;
  $color: string;
  $delay: string;
}>`
  position: absolute;
  top: ${(p) => p.$top};
  left: ${(p) => p.$left};
  width: ${(p) => p.$size};
  height: ${(p) => p.$size};
  border-radius: 50%;
  background: ${(p) => p.$color};
  animation: ${dotFloat} 3.5s ease-in-out ${(p) => p.$delay} infinite;
  z-index: 2;
  pointer-events: none;
`;

/* ─── Content ─── */
const ContentSide = styled.div<{ $reversed?: boolean }>`
  flex: 1;
  animation: ${fadeUp} 0.65s ease both;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${media('<=phone')} {
    text-align: center;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 2rem;
  letter-spacing: -0.04em;
  color: #0f172a;

  .dark & {
    color: white;
  }

  ${media('<=tablet')} {
    font-size: 2.1rem;
    margin-bottom: 1.5rem;
  }

  ${media('<=phone')} {
    font-size: 1.8rem;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 1.25rem;
`;

const StyledRichText = styled(RichText)`
  font-size: 1.1rem;
  line-height: 1.75;
  color: #475569;

  p {
    margin-bottom: 1.25rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-top: 1.5rem;
  }

  ul li {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 1rem;
    font-weight: 500;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.5rem;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #1473fa;
      box-shadow: 0 0 10px rgba(20, 115, 250, 0.3);
    }
  }

  .dark & {
    color: #94a3b8;
  }

  .dark & ul li::before {
    background: #60a5fa;
  }
`;

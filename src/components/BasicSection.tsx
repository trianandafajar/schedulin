import NextImage from 'next/image';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
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

export default function BasicSection({ imageUrl, title, overTitle, reversed, children }: PropsWithChildren<BasicSectionProps>) {
  return (
    <BasicSectionWrapper $reversed={reversed}>
      <ImageContainer>
        <NextImage src={imageUrl} alt={title} fill objectFit="cover" />
      </ImageContainer>
      <ContentContainer>
        <CustomOverTitle>{overTitle}</CustomOverTitle>
        <Title>{title}</Title>
        <RichText>{children}</RichText>
      </ContentContainer>
    </BasicSectionWrapper>
  );
}

const Title = styled.h1`
  font-size: 3.8rem;
  font-weight: bold;
  line-height: 1.15;
  margin-bottom: 2rem;
  letter-spacing: -0.03em;

  ${media('<=tablet')} {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 2rem;
`;

const ImageContainer = styled.div`
  flex: 1;

  position: relative;
  &:before {
    display: block;
    content: '';
    width: 100%;
    padding-top: calc((9 / 16) * 100%);
  }

  & > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  ${media('<=desktop')} {
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
`;

type Props = {
  $reversed?: boolean;
};

const BasicSectionWrapper = styled(Container)<Props>`
  display: flex;
  align-items: center;
  flex-direction: ${(p) => (p.$reversed ? 'row-reverse' : 'row')};

  ${ImageContainer} {
    margin: ${(p) => (p.$reversed ? '0 0 0 3rem' : '0 3rem 0 0')};
  }
`;

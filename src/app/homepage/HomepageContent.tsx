'use client';

import styled from 'styled-components';
import React from 'react';
import Hero from '../../../views/HomePage/Hero';
import Partners from '../../../views/HomePage/Partners';
import BasicSection from '@/components/BasicSection';
import Link from 'next/link';
import Cta from '../../../views/HomePage/Cta';
import FeaturesGallery from '../../../views/HomePage/FeaturesGallery';
import Features from '../../../views/HomePage/Features';
import Testimonials from '../../../views/HomePage/Testimonials';
import ScrollableBlogPosts from '../../../views/HomePage/ScrollableBlogPosts';
import Navbar, { NavItems } from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomepageContent() {
  const navItems: NavItems = [
    { title: 'Awesome SaaS Features', href: '/features' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Contact', href: '/contact' },
    { title: 'Sign up', href: '/signup', outlined: true },
  ];

  return (
    <>
      <Navbar items={navItems} />
      <HomepageWrapper>
        <WhiteBackgroundContainer>
          <Hero />
          {/* <Partners /> */}
          <BasicSection imageUrl="/demo-illustration-1.svg" title="Lorem ipsum dolor sit amet consectetur." overTitle="sit amet gogo">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, quidem error incidunt a doloremque voluptatem porro inventore
              voluptate quo deleniti animi laboriosam.{' '}
              <Link href="/help-center">Possimus ullam velit rem itaque consectetur, in distinctio?</Link> Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Soluta repellendus quia quos obcaecati nihil. Laudantium non accusantium, voluptate eum nesciunt
              at suscipit quis est soluta?
            </p>
          </BasicSection>
          <BasicSection imageUrl="/demo-illustration-2.svg" title="Lorem ipsum dolor sit." overTitle="lorem ipsum" reversed>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, quidem error incidunt a doloremque voluptatem porro inventore{' '}
              <strong>voluptate quo deleniti animi laboriosam</strong>. Possimus ullam velit rem itaque consectetur, in distinctio?
            </p>
            <ul>
              <li>Professional point 1</li>
              <li>Professional remark 2</li>
              <li>Professional feature 3</li>
            </ul>
          </BasicSection>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer>
          <Cta />
          <FeaturesGallery />
          <Features />
          <Testimonials />
          <ScrollableBlogPosts />
        </DarkerBackgroundContainer>
      </HomepageWrapper>
      <Footer/>
    </>
  );
}

const HomepageWrapper = styled.div`
  & > :last-child {
    margin-bottom: 8rem;
  }
`;

const DarkerBackgroundContainer = styled.div`
  background: rgb(var(--background));

  & > *:not(:first-child) {
    margin-top: 8rem;
  }
`;

const WhiteBackgroundContainer = styled.div`
  background: rgb(var(--secondBackground));

  & > :last-child {
    padding-bottom: 8rem;
  }

  & > *:not(:first-child) {
    margin-top: 8rem;
  }
`;

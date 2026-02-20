import { media } from '@/app/utils/media';
import AutofitGrid from '@/components/AutofitGrid';
import BasicCard from '@/components/BasicCard';
import Container from '@/components/Container';
import React from 'react';
import styled from 'styled-components';


const FEATURES = [
  {
    imageUrl: '/grid-icons/asset-1.svg',
    title: 'Smart Availability Rules',
    description: 'Set business hours, buffers, breaks, and blackout dates with flexible scheduling rules.',
  },
  {
    imageUrl: '/grid-icons/asset-2.svg',
    title: 'Online Booking Page',
    description: 'Share one branded link so clients can book in real time from any device.',
  },
  {
    imageUrl: '/grid-icons/asset-3.svg',
    title: 'Automated Reminders',
    description: 'Send email or WhatsApp reminders automatically before every appointment.',
  },
  {
    imageUrl: '/grid-icons/asset-4.svg',
    title: 'Calendar Sync',
    description: 'Connect Google Calendar to avoid double booking across your team.',
  },
  {
    imageUrl: '/grid-icons/asset-5.svg',
    title: 'Reschedule Flow',
    description: 'Let clients reschedule from the confirmation link without contacting support.',
  },
  {
    imageUrl: '/grid-icons/asset-6.svg',
    title: 'Deposit & Payments',
    description: 'Collect deposits at checkout to lower no-shows and protect your time.',
  },
  {
    imageUrl: '/grid-icons/asset-7.svg',
    title: 'Team Routing',
    description: 'Route new bookings to the right staff member based on service and availability.',
  },
  {
    imageUrl: '/grid-icons/asset-8.svg',
    title: 'Custom Intake Forms',
    description: 'Capture client details before meetings so your team is prepared.',
  },
  {
    imageUrl: '/grid-icons/asset-9.svg',
    title: 'Booking Analytics',
    description: 'Track conversion, no-show rates, and top-performing services in one dashboard.',
  },
];

export default function Features() {
  return (
    <Container>
      <CustomAutofitGrid>
        {FEATURES.map((singleFeature, idx) => (
          <BasicCard key={singleFeature.title + idx} {...singleFeature} />
        ))}
      </CustomAutofitGrid>
    </Container>
  );
}

const CustomAutofitGrid = styled(AutofitGrid)`
  --autofit-grid-item-size: 40rem;

  ${media('<=tablet')} {
    --autofit-grid-item-size: 30rem;
  }

  ${media('<=phone')} {
    --autofit-grid-item-size: 100%;
  }
`;

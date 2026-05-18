import { Metadata } from 'next';
import HomepageContent from './HomepageContent';

export const metadata: Metadata = {
  title: 'Schedulin Homepage',
  description: 'SaaS application for automated appointment booking, reminders, and service schedule management.',
};

export default function Homepage() {
  return <HomepageContent />;
}

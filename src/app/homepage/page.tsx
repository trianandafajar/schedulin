import { Metadata } from 'next';
import HomepageContent from './HomepageContent';

export const metadata: Metadata = {
  title: 'maketime | Appointment Booking Platform',
  description: 'Modern appointment booking software with automated reminders and clean team scheduling workflows.',
};

export default function Homepage() {
  return <HomepageContent />;
}

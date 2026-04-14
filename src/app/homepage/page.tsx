import { Metadata } from 'next';
import HomepageContent from './HomepageContent';

export const metadata: Metadata = {
  title: 'Maketime | Appointment Booking Platform',
  description: 'Modern appointment booking software with automated reminders and clean team Maketimeg workflows.',
};

export default function Homepage() {
  return <HomepageContent />;
}

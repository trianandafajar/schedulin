import { Metadata } from 'next';
import HomepageContent from './homepage/HomepageContent';

export const metadata: Metadata = {
  title: 'Maketime',
  description: 'Maketime is an elegant scheduling platform for modern appointment businesses.',
};

export default function Homepage() {
  return <HomepageContent />;
}

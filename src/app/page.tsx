import { Metadata } from 'next';
import HomepageContent from './homepage/HomepageContent';

export const metadata: Metadata = {
  title: 'maketime',
  description: 'maketime is an elegant scheduling platform for modern appointment businesses.',
};

export default function Homepage() {
  return <HomepageContent />;
}

import { Metadata } from 'next';
import HomepageContent from './homepage/HomepageContent';

export const metadata: Metadata = {
  title: 'Schedullin',
  description: 'A Scheduling Application.',
};

export default function Homepage() {
  return <HomepageContent />;
}

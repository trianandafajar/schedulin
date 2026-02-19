import { Metadata } from 'next';
import HomepageContent from './HomepageContent';

export const metadata: Metadata = {
  title: 'Test',
  description: 'Tempor nostrud velit fugiat nostrud duis incididunt Lorem deserunt est tempor aute dolor ad elit.',
};

export default function Homepage() {
  return <HomepageContent />;
}

import { Metadata } from 'next';
import HomepageContent from './HomepageContent';

export const metadata: Metadata = {
  title: 'Schedulin Homepage',
  description: 'SaaS aplikasi untuk booking appointment otomatis, reminder, dan manajemen jadwal layanan.',
};

export default function Homepage() {
  return <HomepageContent />;
}

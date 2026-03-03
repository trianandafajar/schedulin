import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ ...rest }) {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }} {...rest}>
      <Image
        src="/images/menu.jpg"
        alt="Schedullin Logo"
        width={40}
        height={40}
        style={{ borderRadius: '6px', objectFit: 'cover' }}
      />
      <span style={{
        fontSize: '1.15rem',
        fontWeight: 700,
        color: '#0f172a',
        letterSpacing: '-0.02em',
      }}>
        Schedullin
      </span>
    </Link>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ ...rest }) {
  return (
    <Link
      href="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
      }}
      {...rest}
    >
      <Image
        src="/images/logo.svg"
        alt="Schedullin Logo"
        width={46}
        height={46}
        style={{ borderRadius: '8px', objectFit: 'cover' }}
      />
      <span className="text-slate-900 dark:text-slate-100 font-extrabold text-[1.4rem] tracking-[-0.04em]">
        Schedullin
      </span>
    </Link>
  );
}

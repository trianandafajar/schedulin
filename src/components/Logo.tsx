import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ ...rest }) {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} {...rest}>
      <Image
        src="/images/logo.svg"
        alt="Maketime logo"
        width={42}
        height={42}
        style={{ borderRadius: '10px', objectFit: 'cover' }}
      />
      <span className="text-slate-900 dark:text-slate-100 font-semibold text-[1.08rem] tracking-[-0.01em]">
        Maketime
      </span>
    </Link>
  );
}

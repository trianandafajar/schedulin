import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ ...rest }) {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} {...rest}>
      <Image
        src="/images/menu.jpg"
        alt="maketime logo"
        width={38}
        height={38}
        style={{ borderRadius: '10px', objectFit: 'cover' }}
      />
      <span className="text-slate-900 dark:text-slate-100 font-semibold text-[1.08rem] tracking-[-0.01em]">
        maketime
      </span>
    </Link>
  );
}

'use client';
import Link from 'next/link';
import { NavItem, NavLink, NavList } from './Navbar.styles';
import Button from '@/components/ui/button/Button';

export type SingleNavItem = {
  title: string;
  href: string;
  outlined?: boolean;
};

export default function NavLinks({ items }: { items: SingleNavItem[] }) {
  // Smooth scroll handler for anchor links
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80, // offset for fixed header
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <NavList>
      {items.map((item) => (
        <NavItem key={item.href}>
          {item.outlined ? (
            <Button as={Link} href={item.href}>
              {item.title}
            </Button>
          ) : (
            <NavLink as={Link} href={item.href} onClick={(e) => handleScroll(e, item.href)}>
              {item.title}
            </NavLink>
          )}
        </NavItem>
      ))}
    </NavList>
  );
}
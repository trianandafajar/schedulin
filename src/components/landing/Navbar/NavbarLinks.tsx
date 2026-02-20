import Link from "next/link";
import { NavItem, NavLink, NavList } from "./Navbar.styles";
import Button from "@/components/ui/button/Button";

export type SingleNavItem = {
  title: string;
  href: string;
  outlined?: boolean;
};

export default function NavLinks({ items }: { items: SingleNavItem[] }) {
  return (
    <NavList>
      {items.map((item) => (
        <NavItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            {item.outlined ? 
                <Button>{item.title}</Button> : <NavLink>{item.title}</NavLink>}

          </Link>
        </NavItem>
      ))}
    </NavList>
  );
}
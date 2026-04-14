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
          <Link href={item.href}>
            {item.outlined ? (
              <Button
                className="!rounded-full !bg-[#1f4fbf] !px-5 !py-2.5 !text-xs !font-semibold !tracking-[0.01em] hover:!bg-[#173a8f]"
                type="button"
              >
                {item.title}
              </Button>
            ) : (
              <NavLink>{item.title}</NavLink>
            )}
          </Link>
        </NavItem>
      ))}
    </NavList>
  );
}

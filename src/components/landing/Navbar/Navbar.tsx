"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { NavbarContainer, Content, LogoArea } from "./Navbar.styles";
import NavLinks, { type SingleNavItem } from "@/components/landing/Navbar/NavbarLinks";
import Logo from "@/components/Logo";

type Props = { items: SingleNavItem[] };

export default function Navbar({ items }: Props) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  const lastScroll = useRef(0);

  useScrollPosition(({ currPos }) => {
    const current = currPos.y;

    if (Math.abs(current - lastScroll.current) < 10) return;

    setHidden(current < lastScroll.current);
    lastScroll.current = current;
  }, [pathname]);

  return (
    <NavbarContainer $hidden={hidden}>
      <Content>
        <LogoArea>
          <Logo />
        </LogoArea>

        <NavLinks items={items} />
      </Content>
    </NavbarContainer>
  );
}
import styled from "styled-components";
import { media } from "@/app/utils/media";
import Container from "@/components/Container";

export const NavbarContainer = styled.header<{ $hidden: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 999;
  padding: 0 2rem;
  height: 72px;               /* dari 8rem -> 72px */
  background: #ffffff;
  border-bottom: 1px solid rgba(0,0,0,0.06);

  display: flex;
  align-items: center;

  transform: ${(p) => (p.$hidden ? "translateY(-100%)" : "translateY(0)")};
  transition: transform .25s ease;
`;

export const Content = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 28px;

  ${media("<desktop")} {
    display: none;
  }
`;

export const NavItem = styled.li`
  list-style: none;
`;

export const NavLink = styled.a`
  font-size: 16px;
  font-weight: 600;
  color: rgb(var(--text));
  text-decoration: none;

  &:hover {
    color: rgb(var(--primary));
  }
`;

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
`;
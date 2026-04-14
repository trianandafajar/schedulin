import styled from "styled-components";
import { media } from "@/utils/media";
import Container from "@/components/Container";

export const NavbarContainer = styled.header<{ $hidden: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 999;
  height: 76px;
  display: flex;
  align-items: center;
  background: color-mix(in srgb, var(--mk-surface, #f7f8fb) 78%, white 22%);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--mk-border, #d7dce7);

  transform: ${(p) => (p.$hidden ? "translateY(-100%)" : "translateY(0)")};
  transition: transform 0.25s ease;

  .dark & {
    background: #000000;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export const Content = styled(Container)`
  display: flex;
  align-items: center;
  margin: 0 auto;
  max-width: 1280px;
  justify-content: space-between;
`;

export const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.35rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(24, 36, 58, 0.08);

  .dark & {
    background: rgba(20, 22, 30, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  ${media("<desktop")} {
    display: none;
  }
`;

export const NavItem = styled.li`
  list-style: none;
`;

export const NavLink = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.2rem;
  padding: 0 0.95rem;
  border-radius: 999px;
  font-size: 0.86rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--mk-text, #152038);
  text-decoration: none;
  transition: color 0.22s ease, background-color 0.22s ease;

  &:hover {
    color: var(--color-brand-600);
    background: var(--color-brand-50);
  }

  .dark & {
    color: #f5f8ff;
  }

  .dark &:hover {
    color: #bad4ff;
    background: rgba(186, 212, 255, 0.12);
  }
`;

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
`;

import styled from "styled-components";
import { media } from "@/app/utils/media";
import Container from "@/components/Container";

export const NavbarContainer = styled.header<{ $hidden: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 999;
  padding: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transform: ${(p) => (p.$hidden ? 'translateY(-100%)' : 'translateY(0)')};
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;

  .dark & {
    background: rgba(12, 12, 12, 0.85);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

export const Content = styled(Container)`
  display: flex;
  align-items: center;
  margin: 0 auto;
  max-width:1280px;
  
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
  font-size: 15px;
  font-weight: 700;
  color: #475569;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: #1473fa;
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover {
    color: #1473fa;
    &::after {
      width: 100%;
    }
  }

  .dark & {
    color: #94a3b8;
    &:hover {
      color: white;
      &::after {
        background-color: white;
      }
    }
  }
`;

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
`;
import Link from 'next/link';
import styled from 'styled-components';
import Container from './Container';
import { media } from '@/utils/media';

type SingleFooterListItem = { title: string; href: string };
type FooterListItems = SingleFooterListItem[];
type SingleFooterList = { title: string; items: FooterListItems };
type FooterItems = SingleFooterList[];

const footerItems: FooterItems = [
  {
    title: 'Product',
    items: [
      { title: 'Features', href: '/#features' },
      { title: 'Sign Up', href: '/signup' },
      { title: 'Sign In', href: '/signin' },
    ],
  },
  {
    title: 'Company',
    items: [{ title: 'Privacy Policy', href: '/privacy-policy' }],
  },
];

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <TopSection>
          <BrandArea>
            <BrandName>Maketime</BrandName>
            <Tagline>Elegant appointment operations for modern service teams.</Tagline>
          </BrandArea>
          <LinksArea>
            {footerItems.map((group) => (
              <LinkGroup key={group.title}>
                <GroupTitle>{group.title}</GroupTitle>
                {group.items.map((item) => (
                  <LinkItem key={item.href}>
                    <Link href={item.href}>{item.title}</Link>
                  </LinkItem>
                ))}
              </LinkGroup>
            ))}
          </LinksArea>
        </TopSection>
        <Divider />
        <BottomBar>
          <Copyright>© {new Date().getFullYear()} Maketime. All rights reserved.</Copyright>
          <BottomLinks>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </BottomLinks>
        </BottomBar>
      </FooterContainer>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  margin-top: 3.5rem;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-white);

  .dark & {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: #000000;
  }
`;

const FooterContainer = styled(Container)`
  padding-top: 2.3rem;
  padding-bottom: 1.3rem;
  margin: 0 auto;
  max-width: 1280px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2.5rem;

  ${media('<=tablet')} {
    flex-direction: column;
    gap: 1.8rem;
  }
`;

const BrandArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-width: 19rem;
`;

const BrandName = styled.span`
  font-size: 1.15rem;
  font-weight: 600;
  color: #172442;
  letter-spacing: -0.015em;

  .dark & {
    color: var(--color-white);
  }
`;

const Tagline = styled.p`
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.6;
  color: #586888;

  .dark & {
    color: var(--color-gray-400);
  }
`;

const LinksArea = styled.div`
  display: flex;
  gap: 3rem;

  ${media('<=phone')} {
    gap: 1.4rem;
    flex-direction: column;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GroupTitle = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: #1b2a4b;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.2rem;

  .dark & {
    color: var(--color-white);
  }
`;

const LinkItem = styled.div`
  font-size: 0.84rem;

  a {
    text-decoration: none;
    color: #5a6d90;
    transition: color 0.16s ease;

    &:hover {
      color: var(--color-brand-600);
    }

    .dark & {
      color: var(--color-gray-400);
    }

    .dark &:hover {
      color: var(--color-white);
    }
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-brand-100);
  margin: 1.6rem 0 1rem;

  .dark & {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;

  ${media('<=tablet')} {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.78rem;
  color: #6f7f9d;
  margin: 0;

  .dark & {
    color: #9ca9c6;
  }
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1rem;

  a {
    font-size: 0.78rem;
    color: #6f7f9d;
    text-decoration: none;
    transition: color 0.16s ease;

    &:hover {
      color: var(--color-brand-600);
    }

    .dark & {
      color: #9ca9c6;
    }

    .dark &:hover {
      color: #dbe7ff;
    }
  }
`;

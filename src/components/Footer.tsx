import Link from 'next/link';
import styled from 'styled-components';
import Container from './Container';
import { media } from '@/app/utils/media';

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
    items: [
      { title: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
];

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <TopSection>
          <BrandArea>
            <BrandName>Schedulin</BrandName>
            <Tagline>Smart appointment booking for modern teams.</Tagline>
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
          <Copyright>© {new Date().getFullYear()} Schedulin. All rights reserved.</Copyright>
          <BottomLinks>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </BottomLinks>
        </BottomBar>
      </FooterContainer>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;

  .dark & {
    background: #111111;
    border-top: 1px solid #313131;
  }
`;

const FooterContainer = styled(Container)`
  padding-top: 3rem;
  padding-bottom: 1.5rem;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;

  ${media('<=tablet')} {
    flex-direction: column;
    gap: 2rem;
  }
`;

const BrandArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 220px;
`;

const BrandName = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;

  .dark & {
    color: white;
  }
`;

const Tagline = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;

  .dark & {
    color: #e2e2e2;
  }
`;

const LinksArea = styled.div`
  display: flex;
  gap: 3rem;

  ${media('<=phone')} {
    gap: 1.5rem;
    flex-wrap: wrap;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GroupTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.25rem;

  .dark & {
    color: white;
  }
`;

const LinkItem = styled.div`
  font-size: 0.825rem;

  a {
    text-decoration: none;
    color: #64748b;
    transition: color 0.15s ease;

    .dark & {
      color: #e2e2e2;
    }

    &:hover {
      color: #0f172a;

      .dark & {
        color: white;
      }
    }
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2rem 0 1rem;

  .dark & {
    border-top: 1px solid #313131;
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media('<=tablet')} {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;

  .dark & {
    color: #e2e2e2;
  }
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1rem;

  a {
    font-size: 0.75rem;
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.15s ease;

    .dark & {
      color: #e2e2e2;
    }

    &:hover {
      .dark & {
        color: white;
      }
      color: #0f172a;
    }
  }
`;
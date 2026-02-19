import Link from 'next/link';
import { FacebookIcon, LinkedinIcon, TwitterIcon } from 'react-share';
import styled from 'styled-components';
import Container from './Container';
import { media } from '@/app/utils/media';

type SingleFooterListItem = { title: string; href: string };
type FooterListItems = SingleFooterListItem[];
type SingleFooterList = { title: string; items: FooterListItems };
type FooterItems = SingleFooterList[];

const footerItems: FooterItems = [
  {
    title: 'Company',
    items: [
      { title: 'Privacy Policy', href: '/privacy-policy' },
      { title: 'Cookies Policy', href: '/cookies-policy' },
    ],
  },
  {
    title: 'Product',
    items: [
      { title: 'Features', href: '/features' },
      { title: 'Something', href: '/something' },
      { title: 'Something else', href: '/something-else' },
      { title: 'And something else', href: '/and-something-else' },
    ],
  },
  {
    title: 'Knowledge',
    items: [
      { title: 'Blog', href: '/blog' },
      { title: 'Contact', href: '/contact' },
      { title: 'FAQ', href: '/faq' },
      { title: 'Help Center', href: '/help-center' },
    ],
  },
  {
    title: 'More',
    items: [
      { title: 'Features2', href: '/features2' },
      { title: 'Something2', href: '/something2' },
      { title: 'Something else2', href: '/something-else2' },
      { title: 'And something else2', href: '/and-something-else2' },
    ],
  },
];

export default function Footer() {
  return (
    <FooterWrapper>
      <Container>
        <ListContainer>
          {footerItems.map((singleItem) => (
            <FooterList key={singleItem.title} {...singleItem} />
          ))}
        </ListContainer>
        <BottomBar>
          <ShareBar>
            <Link href="https://www.twitter.com/my-saas-startup">
              <TwitterIcon size={36} round />
            </Link>
            <Link href="https://www.facebook.com/my-saas-startup">
              <FacebookIcon size={36} round />
            </Link>
            <Link href="https://www.linkedin.com/my-saas-startup">
              <LinkedinIcon size={36} round />
            </Link>
          </ShareBar>
          <Copyright>© {new Date().getFullYear()} My SaaS Startup</Copyright>
        </BottomBar>
      </Container>
    </FooterWrapper>
  );
}

function FooterList({ title, items }: SingleFooterList) {
  return (
    <ListWrapper>
      <ListHeader>{title}</ListHeader>
      {items.map((singleItem) => (
        <ListItem key={singleItem.href} {...singleItem} />
      ))}
    </ListWrapper>
  );
}

function ListItem({ title, href }: SingleFooterListItem) {
  return (
    <ListItemWrapper>
      <Link href={href}>{title}</Link>
    </ListItemWrapper>
  );
}

const FooterWrapper = styled.footer`
  padding: 8rem 0 3rem;
  background: #f9fafb;
  color: #6b7280;
  border-top: 1px solid #e5e7eb;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4rem;

  ${media('<=tablet')} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media('<=phone')} {
    grid-template-columns: 1fr;
  }
`;

const ListHeader = styled.h4`
  font-weight: 600;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  color: #111827;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:first-child) {
    margin-top: 0.8rem;
  }
`;

const ListItemWrapper = styled.p`
  font-size: 1.4rem;
  margin: 0;

  a {
    text-decoration: none;
    color: #6b7280;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #111827;
  }
`;

const ShareBar = styled.div`
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 1.2rem;
  }
`;

const BottomBar = styled.div`
  margin-top: 5rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media('<=tablet')} {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 1.3rem;
  color: #9ca3af;
  margin: 0;
`;

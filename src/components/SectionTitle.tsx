import { media } from '@/app/utils/media';
import styled from 'styled-components';

const SectionTitle = styled.div`
  font-size: 2.2rem;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: -0.03em;
  text-align: center;

  ${media('<=tablet')} {
    font-size: 1.8rem;
  }
`;

export default SectionTitle;

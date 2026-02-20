import { media } from '@/app/utils/media';
import styled from 'styled-components';

const SectionTitle = styled.div`
  font-size: 3.8rem;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: -0.03em;
  text-align: center;

  ${media('<=tablet')} {
    font-size: 3rem;
  }
`;

export default SectionTitle;

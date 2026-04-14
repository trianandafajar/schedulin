import { media } from '@/utils/media';
import styled from 'styled-components';

const OverTitle = styled.span`
  display: block;
  font-size: 1.3rem;
  letter-spacing: 0.02em;
  font-weight: bold;
  line-height: 0;
  text-transform: uppercase;

  .dark & {
    color: white;
  }

  ${media('<=desktop')} {
    line-height: 1.5;
  }

   ${media('<=phone')} {
    text-align: center;
  }
`;

export default OverTitle;

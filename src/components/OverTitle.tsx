import { media } from '@/app/utils/media';
import styled from 'styled-components';

const OverTitle = styled.span`
  display: block;
  font-size: 1rem;
  letter-spacing: 0.12em;
  font-weight: 800;
  line-height: 1.5;
  text-transform: uppercase;
  color: #1473fa;
  margin-bottom: 0.75rem;

  ${media('<=phone')} {
    text-align: center;
    font-size: 0.9rem;
  }
`;

export default OverTitle;

import { media } from '@/app/utils/media';
import styled from 'styled-components';

const Separator = styled.div`
  margin: 12.5rem 0;
  border: 1px solid rgba(var(--secondary), 0.025);
  height: 0px;

  ${media('<=tablet')} {
    margin: 7.5rem 0;
  }
`;

export default Separator;

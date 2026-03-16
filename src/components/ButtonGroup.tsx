import { media } from '@/app/utils/media';
import styled from 'styled-components';

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${media('>tablet')} {
    & > *:not(:last-child) {
      margin-right: 2rem;
    }
  }

  ${media('<=tablet')} {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }
`;

export default ButtonGroup;

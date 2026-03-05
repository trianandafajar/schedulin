import NextImage from 'next/image';
import styled from 'styled-components';

interface BasicCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function BasicCard({ title, description, imageUrl }: BasicCardProps) {
  return (
    <Card>
      <NextImage src={imageUrl} width={128} height={128} alt={title} />
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  padding: 1.25rem;
  background: rgb(var(--cardBackground));
  box-shadow: var(--shadow-md);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  border-radius: 0.6rem;
  color: rgb(var(--text));
  font-size: 1rem;

  .dark & {
    background: #111111;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  }
    
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
`;

const Title = styled.div`
  font-weight: bold;

  .dark & {
    color: white;
  }
`;

const Description = styled.div`
  opacity: 0.6;

  .dark & {
    color: #e2e2e2;
  }
`;

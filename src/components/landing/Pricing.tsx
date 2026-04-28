'use client';

import React from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 0,
    description: 'Perfect for getting started with online bookings.',
    features: [
      'Public booking link (ON/OFF)',
      'Date & time selection',
      'Max 10 bookings / month',
      'Max 5 services',
      'Appointment settings',
      'Closed Days (max 5 days / month)',
    ],
    buttonText: 'Get Started',
    highlight: false,
  },
  {
    id: 'medium',
    name: 'Medium',
    monthlyPrice: 10,
    description: 'Ideal for growing businesses with more traffic.',
    features: [
      'Everything in Starter +',
      'Max 100–200 bookings / month',
      'Max 10–15 services',
      'Flexible Closed Days',
      'Basic dashboard (booking stats)',
      'Appointment settings',
    ],
    buttonText: 'Upgrade to Medium',
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 19,
    description: 'Scale your business with unlimited everything.',
    features: [
      'Everything in Medium +',
      'Unlimited bookings',
      'Unlimited services',
      'Basic dashboard (booking stats)',
    ],
    buttonText: 'Go Business',
    highlight: false,
  },
];

const Pricing = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  const handlePlanClick = (planId: string) => {
    if (!isSignedIn) {
      router.push('/signin');
    } else {
      router.push('/billing');
    }
  };

  const calculatePrice = (monthlyPrice: number) => {
    if (billingCycle === 'monthly') return monthlyPrice;
    return Math.floor(monthlyPrice * 12 * 0.9); // 10% discount for yearly
  };

  return (
    <Section id="pricing">
      <Container>
        <Header>
          <OverTitle>Pricing Plans</OverTitle>
          <Title>Choose the plan that fits your business</Title>
          <Description>
            Simple, transparent pricing for every stage of your growth. No hidden fees.
          </Description>

          <ToggleContainer>
            <ToggleLabel $active={billingCycle === 'monthly'} onClick={() => setBillingCycle('monthly')}>
              Monthly
            </ToggleLabel>
            <Switch onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}>
              <Slider $active={billingCycle === 'yearly'} />
            </Switch>
            <ToggleLabel $active={billingCycle === 'yearly'} onClick={() => setBillingCycle('yearly')}>
              Yearly <DiscountBadge>10% OFF</DiscountBadge>
            </ToggleLabel>
          </ToggleContainer>
        </Header>

        <PricingGrid>
          {pricingPlans.map((plan, index) => {
            const price = calculatePrice(plan.monthlyPrice);
            return (
              <PricingCard key={index} $highlight={plan.highlight}>
                {plan.highlight && <Badge>Most Popular</Badge>}
                <PlanName>{plan.name}</PlanName>
                <PriceContainer>
                  <Price>${price}</Price>
                  <Period>{billingCycle === 'monthly' ? '/month' : '/year'}</Period>
                </PriceContainer>
                <PlanDescription>{plan.description}</PlanDescription>
                
                <FeatureList>
                  {plan.features.map((feature, fIndex) => (
                    <FeatureItem key={fIndex}>
                      <IconWrapper>
                        <Check size={18} />
                      </IconWrapper>
                      <FeatureText>{feature}</FeatureText>
                    </FeatureItem>
                  ))}
                </FeatureList>

                <ButtonWrapper>
                  <ActionButton 
                    $highlight={plan.highlight}
                    onClick={() => handlePlanClick(plan.id)}
                  >
                    {plan.buttonText}
                  </ActionButton>
                </ButtonWrapper>
              </PricingCard>
            );
          })}
        </PricingGrid>
      </Container>
    </Section>
  );
};

export default Pricing;

const Section = styled.section`
  padding: 8rem 2rem;
  background: rgb(var(--secondBackground));
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OverTitle = styled.span`
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  color: rgb(var(--text));
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: rgb(var(--textSecondary));
  max-width: 600px;
  margin: 0 auto 3rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ToggleLabel = styled.span<{ $active: boolean }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => (props.$active ? 'rgb(var(--text))' : 'rgb(var(--textSecondary))')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
`;

const Switch = styled.div`
  width: 60px;
  height: 32px;
  background: #3b82f6;
  border-radius: 32px;
  position: relative;
  cursor: pointer;
  padding: 4px;
`;

const Slider = styled.div<{ $active: boolean }>`
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  position: absolute;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${(props) => (props.$active ? 'translateX(28px)' : 'translateX(0)')};
`;

const DiscountBadge = styled.span`
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PricingCard = styled.div<{ $highlight?: boolean }>`
  background: rgb(var(--cardBackground));
  border: 1px solid ${(props) => (props.$highlight ? '#3b82f6' : 'rgba(var(--text), 0.1)')};
  border-radius: 2rem;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${(props) => (props.$highlight ? '0 20px 40px rgba(59, 130, 246, 0.15)' : 'none')};
  height: 100%;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  z-index: 10;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--text));
  margin-bottom: 1.5rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 1rem;
`;

const Price = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: rgb(var(--text));
`;

const Period = styled.span`
  font-size: 1.1rem;
  color: rgb(var(--textSecondary));
  margin-left: 0.5rem;
`;

const PlanDescription = styled.p`
  font-size: 1rem;
  color: rgb(var(--textSecondary));
  margin-bottom: 2.5rem;
  min-height: 3rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 3rem 0;
  flex-grow: 1;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FeatureText = styled.span`
  font-size: 1rem;
  color: rgb(var(--text));
  line-height: 1.5;
`;

const ButtonWrapper = styled.div`
  margin-top: auto;
  width: 100%;
`;

const ActionButton = styled.button<{ $highlight?: boolean }>`
  width: 100%;
  padding: 1.25rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${(props) => (props.$highlight ? '#3b82f6' : 'transparent')};
  color: ${(props) => (props.$highlight ? 'white' : '#3b82f6')};
  border: 2px solid #3b82f6;

  &:hover {
    background: ${(props) => (props.$highlight ? '#2563eb' : 'rgba(59, 130, 246, 0.05)')};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

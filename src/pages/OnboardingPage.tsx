
import React from 'react';
import OnboardingForm from '@/components/onboarding/OnboardingForm';

const OnboardingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <OnboardingForm />
    </div>
  );
};

export default OnboardingPage;

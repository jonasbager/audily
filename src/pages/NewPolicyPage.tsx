
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PolicyForm from '@/components/policies/PolicyForm';

const NewPolicyPage: React.FC = () => {
  return (
    <AppLayout>
      <PolicyForm />
    </AppLayout>
  );
};

export default NewPolicyPage;

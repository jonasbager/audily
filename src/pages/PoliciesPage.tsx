
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PolicyList from '@/components/policies/PolicyList';

const PoliciesPage: React.FC = () => {
  return (
    <AppLayout>
      <PolicyList />
    </AppLayout>
  );
};

export default PoliciesPage;


import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

const DashboardPage: React.FC = () => {
  return (
    <AppLayout>
      <DashboardOverview />
    </AppLayout>
  );
};

export default DashboardPage;

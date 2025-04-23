
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

const DashboardPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-full">
        <DashboardOverview />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;

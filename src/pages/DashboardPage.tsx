
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

const DashboardPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <DashboardOverview />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;

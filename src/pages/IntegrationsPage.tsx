
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import IntegrationsHub from '@/components/integrations/IntegrationsHub';

const IntegrationsPage: React.FC = () => {
  return (
    <AppLayout>
      <IntegrationsHub />
    </AppLayout>
  );
};

export default IntegrationsPage;


import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EvidenceUploader from '@/components/evidence/EvidenceUploader';

const EvidencePage: React.FC = () => {
  return (
    <AppLayout>
      <EvidenceUploader />
    </AppLayout>
  );
};

export default EvidencePage;

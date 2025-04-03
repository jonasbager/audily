
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PolicyEditor from '@/components/policies/PolicyEditor';

const PolicyEditorPage: React.FC = () => {
  return (
    <AppLayout>
      <PolicyEditor />
    </AppLayout>
  );
};

export default PolicyEditorPage;

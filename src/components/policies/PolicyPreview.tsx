
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PolicySections } from '@/utils/policyGenerator';
import { sectionTitles } from '@/utils/policyGenerator';
import { Policy } from '@/services/policyService';

interface PolicyPreviewProps {
  policy: Policy;
  sections: PolicySections;
}

const PolicyPreview: React.FC<PolicyPreviewProps> = ({ policy, sections }) => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-2xl">{policy.title}</CardTitle>
        <CardDescription>Framework: {policy.framework.toUpperCase()}</CardDescription>
      </CardHeader>
      <CardContent className="prose max-w-none">
        {Object.entries(sections).map(([sectionKey, content]) => (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {sectionTitles[sectionKey] || sectionKey}
            </h3>
            <div className="whitespace-pre-line">{content}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PolicyPreview;

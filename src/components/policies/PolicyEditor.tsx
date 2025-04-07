
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePolicy } from '@/hooks/usePolicies';
import { defaultSections, PolicySections } from '@/utils/policyGenerator';
import PolicySection from './PolicySection';
import PolicyPreview from './PolicyPreview';
import PolicyApproval from './PolicyApproval';

const PolicyEditor: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  
  const { data: policy, isLoading } = usePolicy(policyId);
  
  // State for sections content - stored as JSON in the database
  const [sections, setSections] = useState<PolicySections>(defaultSections);
  const [isApproved, setIsApproved] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  
  // Parse the content from the policy when it loads
  useEffect(() => {
    if (policy) {
      try {
        // Try to parse the description as JSON for the sections
        if (policy.description) {
          const parsedSections = JSON.parse(policy.description);
          if (parsedSections && typeof parsedSections === 'object') {
            setSections(parsedSections);
          }
        }
        setIsApproved(policy.status === 'complete');
      } catch (e) {
        // If parsing fails, just use the description as is
        setSections({
          ...defaultSections,
          purpose: policy.description || ''
        });
      }
    }
  }, [policy]);
  
  const updateSection = (sectionName: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: content
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading policy...</span>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/policies')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Policy Not Found</h1>
        </div>
        <p>The policy you are looking for could not be found. It may have been deleted or you may not have access to it.</p>
        <Button onClick={() => navigate('/policies')}>Go Back to Policies</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/policies')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{policy.title}</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="edit">Edit Policy</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <div className="space-y-6">
            {Object.entries(sections).map(([sectionKey, content]) => (
              <PolicySection
                key={sectionKey}
                sectionKey={sectionKey}
                title={sectionKey ? sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1) : sectionKey}
                content={content}
                policyTitle={policy.title}
                framework={policy.framework}
                onChange={updateSection}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <PolicyPreview policy={policy} sections={sections} />
        </TabsContent>
      </Tabs>
      
      <PolicyApproval 
        policy={policy} 
        sections={sections}
        isApproved={isApproved}
        setIsApproved={setIsApproved}
      />
    </div>
  );
};

export default PolicyEditor;

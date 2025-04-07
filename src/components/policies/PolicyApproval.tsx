
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, Save, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PolicySections } from '@/utils/policyGenerator';
import { useUpdatePolicy } from '@/hooks/usePolicies';
import { Policy } from '@/services/policyService';

interface PolicyApprovalProps {
  policy: Policy;
  sections: PolicySections;
  isApproved: boolean;
  setIsApproved: (value: boolean) => void;
}

const PolicyApproval: React.FC<PolicyApprovalProps> = ({
  policy,
  sections,
  isApproved,
  setIsApproved
}) => {
  const { toast } = useToast();
  const updatePolicyMutation = useUpdatePolicy();
  
  const savePolicy = async () => {
    try {
      // Store sections as JSON in the description field
      await updatePolicyMutation.mutateAsync({
        id: policy.id,
        updates: {
          description: JSON.stringify(sections),
        }
      });
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };
  
  const approvePolicy = async () => {
    try {
      await updatePolicyMutation.mutateAsync({
        id: policy.id,
        updates: {
          status: 'complete',
          description: JSON.stringify(sections),
        }
      });
      setIsApproved(true);
      
      toast({
        title: 'Policy approved',
        description: 'The policy has been approved and marked as complete.',
      });
    } catch (error) {
      console.error('Error approving policy:', error);
    }
  };
  
  const downloadPolicy = () => {
    // Here we would generate a PDF
    toast({
      title: 'Download started',
      description: 'Your policy is being downloaded as a PDF.',
    });
  };

  const allSectionsHaveContent = Object.values(sections).every(s => s.trim().length > 0);

  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="approve" 
          checked={isApproved} 
          onCheckedChange={() => setIsApproved(!isApproved)} 
          disabled={policy.status === 'complete'}
        />
        <Label htmlFor="approve">
          I approve this policy document
        </Label>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={downloadPolicy}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={savePolicy} disabled={updatePolicyMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updatePolicyMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button 
          onClick={approvePolicy} 
          disabled={!allSectionsHaveContent || isApproved || updatePolicyMutation.isPending}
          variant="default"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          Mark as Complete
        </Button>
      </div>
    </div>
  );
};

export default PolicyApproval;

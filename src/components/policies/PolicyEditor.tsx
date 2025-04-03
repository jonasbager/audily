
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  Save, 
  CheckSquare,
  ArrowLeft
} from 'lucide-react';

interface PolicySections {
  [key: string]: string;
}

// This is mock data - in a real app we would fetch from API
const policyData = {
  'access-control': {
    name: 'Access Control Policy',
    description: 'This policy establishes the rules and regulations that govern access to company systems and data.',
    sections: {
      purpose: 'The purpose of this Access Control Policy is to establish rules and regulations that govern access to company systems, data, and resources.',
      scope: 'This policy applies to all employees, contractors, consultants, temporary staff, and other workers at the company, including all personnel affiliated with third parties.',
      policy: 'Access to company systems and data will be granted on a need-to-know basis. All users must have unique accounts, and shared accounts are prohibited.\n\nAccess rights are reviewed quarterly and immediately revoked when an employee is terminated.\n\nMulti-factor authentication is required for all systems containing sensitive data.\n\nRemote access to the company network must use secure methods such as VPNs.',
      responsibilities: 'System Administrators are responsible for implementing technical controls.\n\nManagers are responsible for approving access requests for their direct reports.\n\nThe Security Team is responsible for regular access reviews.',
      compliance: 'Failure to comply with this policy may result in disciplinary action, up to and including termination of employment.',
    },
    status: 'complete',
  },
  // Additional policies would be defined here
};

// Mock AI-generated text function
const generatePolicyText = (sectionName: string, policyName: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // This is where we would call our AI API
      const dummyText = `This is an AI-generated ${sectionName} for the ${policyName}. In a real application, this would be generated using OpenAI's GPT-4 API based on company information and compliance requirements.`;
      resolve(dummyText);
    }, 1500);
  });
};

const PolicyEditor: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const policy = policyId && policyData[policyId] 
    ? policyData[policyId] 
    : {
        name: 'New Policy',
        description: 'Create a new policy',
        sections: {
          purpose: '',
          scope: '',
          policy: '',
          responsibilities: '',
          compliance: '',
        },
        status: 'not-started',
      };
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<PolicySections>(policy.sections);
  const [isApproved, setIsApproved] = useState(policy.status === 'complete');
  const [activeTab, setActiveTab] = useState('edit');
  
  const updateSection = (sectionName: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: content
    }));
  };
  
  const generateSection = async (sectionName: string) => {
    setIsGenerating(true);
    try {
      const generated = await generatePolicyText(sectionName, policy.name);
      updateSection(sectionName, generated);
      
      toast({
        title: 'Section generated',
        description: `The ${sectionName} section has been updated with AI-generated content.`,
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: 'There was an error generating the content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const savePolicy = () => {
    // Here we would save to the backend
    toast({
      title: 'Policy saved',
      description: 'Your policy has been saved successfully.',
    });
  };
  
  const approvePolicy = () => {
    setIsApproved(true);
    toast({
      title: 'Policy approved',
      description: 'The policy has been approved and marked as complete.',
    });
  };
  
  const downloadPolicy = () => {
    // Here we would generate a PDF
    toast({
      title: 'Download started',
      description: 'Your policy is being downloaded as a PDF.',
    });
  };
  
  const sectionTitles = {
    purpose: 'Purpose and Objectives',
    scope: 'Scope and Applicability',
    policy: 'Policy Statement',
    responsibilities: 'Roles and Responsibilities',
    compliance: 'Compliance and Enforcement',
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/policies')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{policy.name}</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="edit">Edit Policy</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <div className="space-y-6">
            {Object.entries(sections).map(([sectionKey, content]) => (
              <Card key={sectionKey} className="card-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">
                    {sectionTitles[sectionKey as keyof typeof sectionTitles]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={content}
                    onChange={(e) => updateSection(sectionKey, e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateSection(sectionKey)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Generate with AI
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">{policy.name}</CardTitle>
              <CardDescription>{policy.description}</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              {Object.entries(sections).map(([sectionKey, content]) => (
                <div key={sectionKey} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {sectionTitles[sectionKey as keyof typeof sectionTitles]}
                  </h3>
                  <div className="whitespace-pre-line">{content}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="approve" 
            checked={isApproved} 
            onCheckedChange={() => setIsApproved(!isApproved)} 
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
          <Button onClick={savePolicy}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button 
            onClick={approvePolicy} 
            disabled={!Object.values(sections).every(s => s.trim().length > 0) || isApproved}
            variant="default"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Mark as Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PolicyEditor;

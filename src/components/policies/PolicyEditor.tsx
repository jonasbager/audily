
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
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { usePolicy, useUpdatePolicy } from '@/hooks/usePolicies';

// Generic section titles that work for both frameworks
const sectionTitles = {
  purpose: 'Purpose and Objectives',
  scope: 'Scope and Applicability',
  policy: 'Policy Statement',
  responsibilities: 'Roles and Responsibilities',
  compliance: 'Compliance and Enforcement',
};

// Mock AI-generated text function - would be replaced with a real API call
const generatePolicyText = (sectionName: string, policyName: string, framework: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // This is where we would call our AI API
      const frameworkSpecificText = framework === 'nis2'
        ? `This is an AI-generated ${sectionName} for the ${policyName} aligned with NIS2 Directive requirements. It covers cybersecurity measures, incident reporting, and risk assessment for essential services.`
        : `This is an AI-generated ${sectionName} for the ${policyName} aligned with ${framework.toUpperCase()} requirements. It focuses on financial reporting controls, documentation standards, and testing procedures.`;
      
      resolve(frameworkSpecificText);
    }, 1500);
  });
};

interface PolicySections {
  [key: string]: string;
}

const PolicyEditor: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: policy, isLoading } = usePolicy(policyId);
  const updatePolicyMutation = useUpdatePolicy();

  // Default sections for new policies
  const defaultSections = {
    purpose: '',
    scope: '',
    policy: '',
    responsibilities: '',
    compliance: '',
  };

  // State for sections content - stored as JSON in the database
  const [sections, setSections] = useState<PolicySections>(defaultSections);
  const [isApproved, setIsApproved] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Parse the content from the policy when it loads
  React.useEffect(() => {
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
  
  const generateSection = async (sectionName: string) => {
    if (!policy) return;
    
    setIsGenerating(true);
    try {
      const generated = await generatePolicyText(
        sectionTitles[sectionName as keyof typeof sectionTitles] || sectionName, 
        policy.title, 
        policy.framework
      );
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
  
  const savePolicy = async () => {
    if (!policy) return;
    
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
    if (!policy) return;
    
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
              <Card key={sectionKey} className="card-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">
                    {sectionTitles[sectionKey as keyof typeof sectionTitles] || sectionKey}
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
              <CardTitle className="text-2xl">{policy.title}</CardTitle>
              <CardDescription>Framework: {policy.framework.toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              {Object.entries(sections).map(([sectionKey, content]) => (
                <div key={sectionKey} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {sectionTitles[sectionKey as keyof typeof sectionTitles] || sectionKey}
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
            disabled={!Object.values(sections).every(s => s.trim().length > 0) || isApproved || updatePolicyMutation.isPending}
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

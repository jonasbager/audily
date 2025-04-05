
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Generic section titles that work for both frameworks
const sectionTitles = {
  purpose: 'Purpose and Objectives',
  scope: 'Scope and Applicability',
  policy: 'Policy Statement',
  responsibilities: 'Roles and Responsibilities',
  compliance: 'Compliance and Enforcement',
};

// This is mock data - in a real app we would fetch from API
const nis2PolicyData = {
  'risk-assessment': {
    name: 'Risk Assessment Policy',
    description: 'This policy establishes guidelines for identifying and assessing cybersecurity risks in accordance with NIS2.',
    sections: {
      purpose: 'The purpose of this Risk Assessment Policy is to define methodologies for identifying, evaluating, and documenting cybersecurity risks to essential services.',
      scope: 'This policy applies to all systems, networks, and data supporting essential services as defined by NIS2.',
      policy: 'Risk assessments must be conducted at least annually and after any significant changes to infrastructure. The risk assessment must identify threats and vulnerabilities, evaluate current controls, and determine risk likelihood and impact.',
      responsibilities: 'The CISO is responsible for oversight of the risk assessment program. Business units must contribute to identifying risks relevant to their operations.',
      compliance: 'Failure to comply with this policy may result in regulatory penalties under NIS2 Article 20.',
    },
    status: 'complete',
    framework: 'nis2'
  },
};

const soxPolicyData = {
  'internal-control': {
    name: 'Internal Control Framework',
    description: 'This policy establishes controls to ensure accurate financial reporting in accordance with SOX Section 404.',
    sections: {
      purpose: 'The purpose of this Internal Control Framework is to ensure the reliability of financial reporting and the preparation of financial statements.',
      scope: 'This policy applies to all financial reporting processes and IT systems that support financial operations.',
      policy: 'All financial reporting processes must have documented controls with clear ownership, testing schedules, and evidence requirements. Control testing must occur quarterly with results reported to the audit committee.',
      responsibilities: 'The CFO is responsible for the overall internal control framework. Process owners must design, implement and maintain controls within their areas.',
      compliance: 'Failure to comply with this policy may result in material weaknesses or significant deficiencies in SOX reporting.',
    },
    status: 'complete',
    framework: 'sox'
  },
};

// Combine the policy data
const policyData = {
  ...nis2PolicyData,
  ...soxPolicyData,
  // Additional policies would be defined here
};

// Mock AI-generated text function
const generatePolicyText = (sectionName: string, policyName: string, framework: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // This is where we would call our AI API
      const frameworkSpecificText = framework === 'nis2'
        ? `This is an AI-generated ${sectionName} for the ${policyName} aligned with NIS2 Directive requirements. It covers cybersecurity measures, incident reporting, and risk assessment for essential services.`
        : `This is an AI-generated ${sectionName} for the ${policyName} aligned with SOX requirements. It focuses on financial reporting controls, documentation standards, and testing procedures.`;
      
      resolve(frameworkSpecificText);
    }, 1500);
  });
};

const PolicyEditor: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFramework, setSelectedFramework] = useState<string>('nis2');
  
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
        framework: selectedFramework
      };
  
  // Set framework based on policy if policy exists
  useEffect(() => {
    if (policyId && policyData[policyId]?.framework) {
      setSelectedFramework(policyData[policyId].framework);
    }
  }, [policyId]);
  
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
      const generated = await generatePolicyText(sectionName, policy.name, selectedFramework);
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/policies')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{policy.name}</h1>
      </div>
      
      {!policyId && (
        <div className="mb-6">
          <Label htmlFor="framework-select">Compliance Framework</Label>
          <Select 
            value={selectedFramework}
            onValueChange={setSelectedFramework}
          >
            <SelectTrigger className="w-[180px] mt-2">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nis2">NIS2</SelectItem>
              <SelectItem value="sox">SOX</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
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

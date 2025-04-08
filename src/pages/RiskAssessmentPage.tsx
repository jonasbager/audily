
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Shield, AlertTriangle, CheckCheck, Info } from 'lucide-react';
import { useOnboardingProfile } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface RiskItem {
  riskArea: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  mitigationSuggestion: string;
}

const RiskAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: onboardingData, isLoading: onboardingLoading } = useOnboardingProfile();
  const [activeTab, setActiveTab] = useState('guided');
  const [loading, setLoading] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskItem[]>([]);
  const [formData, setFormData] = useState({
    systems: [] as string[],
    vendors: [] as string[],
    dataTypes: [] as string[],
    industry: '',
    size: '',
  });

  // Define common system options
  const systemOptions = [
    { id: 'aws', label: 'AWS' },
    { id: 'azure', label: 'Microsoft Azure' },
    { id: 'gcp', label: 'Google Cloud' },
    { id: 'office365', label: 'Microsoft 365' },
    { id: 'googleworkspace', label: 'Google Workspace' },
    { id: 'salesforce', label: 'Salesforce' },
    { id: 'github', label: 'GitHub' },
    { id: 'gitlab', label: 'GitLab' },
    { id: 'slack', label: 'Slack' },
  ];

  // Define vendor options
  const vendorOptions = [
    { id: 'aws', label: 'Amazon Web Services' },
    { id: 'microsoft', label: 'Microsoft' },
    { id: 'google', label: 'Google' },
    { id: 'salesforce', label: 'Salesforce' },
    { id: 'github', label: 'GitHub' },
    { id: 'atlassian', label: 'Atlassian' },
    { id: 'zoom', label: 'Zoom' },
    { id: 'slack', label: 'Slack' },
  ];

  // Pre-populate form with onboarding data
  React.useEffect(() => {
    if (onboardingData) {
      setFormData(prev => ({
        ...prev,
        systems: onboardingData.systems || [],
        industry: onboardingData.industry || '',
        size: onboardingData.team_size || '',
      }));
    }
  }, [onboardingData]);

  const handleSystemToggle = (id: string) => {
    setFormData(prev => {
      const systems = prev.systems.includes(id)
        ? prev.systems.filter(s => s !== id)
        : [...prev.systems, id];
      return { ...prev, systems };
    });
  };

  const handleVendorToggle = (id: string) => {
    setFormData(prev => {
      const vendors = prev.vendors.includes(id)
        ? prev.vendors.filter(v => v !== id)
        : [...prev.vendors, id];
      return { ...prev, vendors };
    });
  };

  const generateRiskAssessment = async () => {
    if (formData.systems.length === 0) {
      toast({
        title: "Systems required",
        description: "Please select at least one system used by your organization",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Call the OpenAI function to generate risk assessment
      const { data, error } = await supabase.functions.invoke('openai', {
        body: {
          type: 'risk_assessment',
          companyData: {
            industry: formData.industry || onboardingData?.industry || 'Technology',
            size: formData.size || onboardingData?.team_size || 'Small',
            systems: formData.systems,
            vendors: formData.vendors.length > 0 ? formData.vendors : formData.systems,
          },
          framework: onboardingData?.compliance_framework || 'nis2'
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data.riskProfile && data.riskProfile.length > 0) {
        setRiskProfile(data.riskProfile);
        setActiveTab('results');
      } else {
        throw new Error('No risk profile was generated');
      }
    } catch (error) {
      console.error('Error generating risk assessment:', error);
      toast({
        title: "Error generating risk assessment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High Impact</Badge>;
      case 'medium':
        return <Badge variant="default">Medium Impact</Badge>;
      case 'low':
        return <Badge variant="outline">Low Impact</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Risk Assessment</h1>
          <p className="text-muted-foreground">
            Identify and document your organization's key risks related to 
            {onboardingData?.compliance_framework 
              ? ` ${onboardingData.compliance_framework.toUpperCase()} compliance` 
              : ' compliance'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="guided">Guided Assessment</TabsTrigger>
            <TabsTrigger value="results" disabled={riskProfile.length === 0}>
              Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guided">
            <Card>
              <CardHeader>
                <CardTitle>Systems & Vendors Risk Assessment</CardTitle>
                <CardDescription>
                  Provide information about your systems and vendors to generate a risk assessment
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">What systems does your organization use?</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select all that apply
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {systemOptions.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`system-${option.id}`}
                            checked={formData.systems.includes(option.id)}
                            onCheckedChange={() => handleSystemToggle(option.id)}
                          />
                          <label 
                            htmlFor={`system-${option.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base">Which vendors does your organization work with?</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select all that apply
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {vendorOptions.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`vendor-${option.id}`}
                            checked={formData.vendors.includes(option.id)}
                            onCheckedChange={() => handleVendorToggle(option.id)}
                          />
                          <label 
                            htmlFor={`vendor-${option.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button
                  onClick={generateRiskAssessment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Risk Assessment'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Risk Assessment Results</CardTitle>
                    <CardDescription>
                      Generated based on your organization's profile and systems
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('guided')}>
                    Back to Assessment
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {riskProfile.map((risk, index) => (
                    <Card key={index} className="border shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base font-medium">
                            {risk.riskArea}
                          </CardTitle>
                          {getImpactBadge(risk.impact)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                              Risk Description
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {risk.description}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                              <Shield className="h-3.5 w-3.5 text-green-500" />
                              Mitigation Suggestion
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {risk.mitigationSuggestion}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mr-1" />
                  <span>This assessment should be regularly updated</span>
                </div>
                <Button onClick={() => navigate('/dashboard')}>
                  Return to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default RiskAssessmentPage;

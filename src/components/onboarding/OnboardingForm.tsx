
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle } from 'lucide-react';
import { useSaveOnboardingData, useOnboardingData } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import PersonalInfoStep from './PersonalInfoStep';
import SystemsInfoStep from './SystemsInfoStep';
import AdditionalInfoStep from './AdditionalInfoStep';

const formSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name is required' }),
  teamSize: z.string().min(1, { message: 'Team size is required' }),
  complianceFramework: z.string().min(1, { message: 'Compliance framework is required' }),
  systems: z.array(z.string()).min(1, { message: 'Please select at least one system' }),
  targetDate: z.string().min(1, { message: 'Target date is required' }),
  contactRole: z.string().min(1, { message: 'Role is required' }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const OnboardingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: existingData, isLoading, error: loadingError } = useOnboardingData();
  const { mutate: saveData, isPending: isSaving } = useSaveOnboardingData();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      teamSize: '',
      complianceFramework: '',
      systems: [],
      targetDate: '',
      contactRole: '',
      additionalInfo: '',
    },
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please login to complete your onboarding',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (existingData) {
      // Pre-populate form with existing data from the database
      form.reset({
        companyName: existingData.company_name || '',
        teamSize: existingData.team_size || '',
        complianceFramework: existingData.compliance_framework || '',
        systems: existingData.systems || [],
        targetDate: existingData.target_date || '',
        contactRole: existingData.contact_role || '',
        additionalInfo: existingData.additional_info || '',
      });
    }
  }, [existingData, form]);

  const nextStep = () => {
    // Validate current step before proceeding
    let currentFields: string[] = [];
    
    if (step === 1) {
      currentFields = ['companyName', 'teamSize', 'complianceFramework'];
    } else if (step === 2) {
      currentFields = ['systems', 'targetDate'];
    }
    
    form.trigger(currentFields as any).then((isValid) => {
      if (isValid && step < 3) {
        setStep(step + 1);
      }
    });
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (!user) {
      toast({
        title: 'Error saving profile',
        description: 'You must be logged in to save your profile',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    saveData({
      company_name: data.companyName,
      team_size: data.teamSize,
      compliance_framework: data.complianceFramework,
      systems: data.systems,
      target_date: data.targetDate,
      contact_role: data.contactRole,
      additional_info: data.additionalInfo,
      profile_complete: true
    }, {
      onSuccess: () => {
        toast({
          title: 'Profile completed',
          description: 'Your compliance profile has been saved',
        });
        navigate('/dashboard');
      },
      onError: (error) => {
        toast({
          title: 'Error saving profile',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto card-shadow">
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading your profile...</span>
        </CardContent>
      </Card>
    );
  }

  if (loadingError) {
    return (
      <Card className="w-full max-w-3xl mx-auto card-shadow">
        <CardContent className="py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load profile data. Please try again later.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate('/auth')}>
              Return to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto card-shadow">
      <CardHeader>
        <CardTitle>Set Up Your Compliance Profile</CardTitle>
        <CardDescription>
          Tell us about your organization to get a customized compliance plan
        </CardDescription>
        <Progress 
          value={(step / 3) * 100} 
          className="mt-4"
        />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <PersonalInfoStep form={form} />
            )}
            
            {step === 2 && (
              <SystemsInfoStep form={form} />
            )}
            
            {step === 3 && (
              <AdditionalInfoStep form={form} />
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
        >
          Previous
        </Button>
        
        <div>
          {step < 3 ? (
            <Button onClick={nextStep}>
              Continue
            </Button>
          ) : (
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;

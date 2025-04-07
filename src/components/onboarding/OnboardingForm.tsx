
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
import { Loader2 } from 'lucide-react';
import { useSaveOnboardingData, useOnboardingData } from '@/hooks/useOnboarding';
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
  const { data: existingData, isLoading } = useOnboardingData();
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
    if (existingData) {
      form.reset({
        companyName: existingData.company_name,
        teamSize: existingData.team_size,
        complianceFramework: existingData.compliance_framework,
        systems: existingData.systems,
        targetDate: existingData.target_date,
        contactRole: existingData.contact_role,
        additionalInfo: existingData.additional_info || '',
      });
    }
  }, [existingData, form]);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = (data: FormValues) => {
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
        navigate('/dashboard');
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

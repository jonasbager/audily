
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name is required' }),
  teamSize: z.string().min(1, { message: 'Team size is required' }),
  systems: z.array(z.string()).min(1, { message: 'Please select at least one system' }),
  targetDate: z.string().min(1, { message: 'Target date is required' }),
  contactRole: z.string().min(1, { message: 'Role is required' }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const OnboardingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      teamSize: '',
      systems: [],
      targetDate: '',
      contactRole: '',
      additionalInfo: '',
    },
  });

  const systemOptions = [
    { id: 'google', label: 'Google Workspace' },
    { id: 'aws', label: 'AWS' },
    { id: 'github', label: 'GitHub' },
    { id: 'azure', label: 'Microsoft Azure' },
    { id: 'slack', label: 'Slack' },
  ];

  const roleOptions = [
    { value: 'ceo', label: 'CEO' },
    { value: 'cto', label: 'CTO' },
    { value: 'ciso', label: 'CISO' },
    { value: 'compliance', label: 'Compliance Lead' },
    { value: 'other', label: 'Other' },
  ];

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
    console.log('Form submitted:', data);
    
    // In a real app, we would:
    // 1. Send data to the backend
    // 2. Generate risk profile with GPT-4
    // 3. Create customized checklist
    
    // For now, simulate success and redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto card-shadow">
      <CardHeader>
        <CardTitle>Set Up Your SOC 2 Compliance Profile</CardTitle>
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
              <>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="teamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="systems"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Key Systems Used</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {systemOptions.map((system) => (
                          <FormField
                            key={system.id}
                            control={form.control}
                            name="systems"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={system.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(system.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedSystems = checked
                                          ? [...field.value, system.id]
                                          : field.value?.filter(
                                              (value) => value !== system.id
                                            );
                                        field.onChange(updatedSystems);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {system.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SOC 2 Target Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="contactRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific compliance challenges or goals..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
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
            <Button onClick={form.handleSubmit(onSubmit)}>
              Complete Setup
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;

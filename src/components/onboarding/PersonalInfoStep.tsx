
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';

interface PersonalInfoStepProps {
  form: UseFormReturn<any>;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ form }) => {
  return (
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

      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="technology">Technology / Software</SelectItem>
                <SelectItem value="financial-services">Financial Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail / E-commerce</SelectItem>
                <SelectItem value="energy">Energy / Utilities</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="auditStage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Audit Preparation Stage</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current stage" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="just-starting">Just starting (planning phase)</SelectItem>
                <SelectItem value="gathering-requirements">Gathering requirements</SelectItem>
                <SelectItem value="implementing-controls">Implementing controls</SelectItem>
                <SelectItem value="documenting-evidence">Documenting evidence</SelectItem>
                <SelectItem value="preparing-for-audit">Preparing for formal audit</SelectItem>
                <SelectItem value="post-audit">Post-audit remediation</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="complianceFramework"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Choose Compliance Framework</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="nis2" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    NIS2 (EU Cybersecurity Directive)
                  </FormLabel>
                </FormItem>
                <div className="pl-7 text-sm text-muted-foreground mb-2">
                  For EU organizations providing essential or important services
                </div>
                
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="sox" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    SOX (Sarbanes-Oxley Act)
                  </FormLabel>
                </FormItem>
                <div className="pl-7 text-sm text-muted-foreground">
                  For public companies, financial reporting and internal control requirements
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PersonalInfoStep;

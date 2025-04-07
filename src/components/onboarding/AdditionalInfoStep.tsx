
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface AdditionalInfoStepProps {
  form: UseFormReturn<any>;
}

const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({ form }) => {
  const roleOptions = [
    { value: 'ceo', label: 'CEO' },
    { value: 'cto', label: 'CTO' },
    { value: 'ciso', label: 'CISO' },
    { value: 'compliance', label: 'Compliance Lead' },
    { value: 'other', label: 'Other' },
  ];

  return (
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
  );
};

export default AdditionalInfoStep;


import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';

interface SystemsInfoStepProps {
  form: UseFormReturn<any>;
}

const SystemsInfoStep: React.FC<SystemsInfoStepProps> = ({ form }) => {
  const systemOptions = [
    { id: 'google', label: 'Google Workspace' },
    { id: 'aws', label: 'AWS' },
    { id: 'github', label: 'GitHub' },
    { id: 'azure', label: 'Microsoft Azure' },
    { id: 'slack', label: 'Slack' },
  ];

  return (
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
                                    (value: string) => value !== system.id
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
            <FormLabel>Compliance Target Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SystemsInfoStep;

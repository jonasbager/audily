
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreatePolicy, useUpdatePolicy } from '@/hooks/usePolicies';
import { Policy } from '@/services/policyService';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  framework: z.string().min(1, { message: "Please select a framework" }),
  status: z.string().default("draft"),
});

interface PolicyFormProps {
  policy?: Policy;
  isEdit?: boolean;
}

const PolicyForm: React.FC<PolicyFormProps> = ({ policy, isEdit = false }) => {
  const navigate = useNavigate();
  const createPolicy = useCreatePolicy();
  const updatePolicy = useUpdatePolicy();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: policy?.title || "",
      description: policy?.description || "",
      framework: policy?.framework || "nis2",
      status: policy?.status || "draft",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isEdit && policy) {
      await updatePolicy.mutateAsync({
        id: policy.id,
        updates: values
      });
      navigate(`/policies/${policy.id}`);
    } else {
      const result = await createPolicy.mutateAsync(values);
      if (result) {
        navigate(`/policies/${result.id}`);
      }
    }
  };

  const isSubmitting = form.formState.isSubmitting || createPolicy.isPending || updatePolicy.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/policies')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Policy' : 'Create New Policy'}</h1>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Policy Details' : 'Policy Details'}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Data Protection Policy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the policy" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="framework"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compliance Framework</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a framework" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nis2">NIS2</SelectItem>
                        <SelectItem value="sox">SOX</SelectItem>
                        <SelectItem value="gdpr">GDPR</SelectItem>
                        <SelectItem value="hipaa">HIPAA</SelectItem>
                        <SelectItem value="iso27001">ISO 27001</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/policies')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Policy'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PolicyForm;

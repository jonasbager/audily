
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useCreatePolicy } from '@/hooks/usePolicies';

const PolicyForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [framework, setFramework] = useState('nis2');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const createPolicyMutation = useCreatePolicy();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Validation error",
        description: "Please provide a policy title",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newPolicy = await createPolicyMutation.mutateAsync({
        title: title.trim(),
        framework: framework,
      });
      
      if (newPolicy) {
        navigate(`/policies/${newPolicy.id}`);
      }
    } catch (error) {
      console.error('Error creating policy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Policy Title</Label>
            <Input
              id="title"
              placeholder="e.g. Information Security Policy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="framework">Compliance Framework</Label>
            <RadioGroup 
              value={framework} 
              onValueChange={setFramework} 
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nis2" id="nis2" />
                <Label htmlFor="nis2" className="font-normal">NIS2 Directive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sox" id="sox" />
                <Label htmlFor="sox" className="font-normal">SOX Compliance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gdpr" id="gdpr" />
                <Label htmlFor="gdpr" className="font-normal">GDPR</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="iso27001" id="iso27001" />
                <Label htmlFor="iso27001" className="font-normal">ISO 27001</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Policy'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PolicyForm;

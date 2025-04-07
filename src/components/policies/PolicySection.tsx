
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePolicyText } from '@/utils/policyGenerator';

interface PolicySectionProps {
  sectionKey: string;
  title: string;
  content: string;
  policyTitle: string;
  framework: string;
  onChange: (sectionKey: string, content: string) => void;
}

const PolicySection: React.FC<PolicySectionProps> = ({
  sectionKey,
  title,
  content,
  policyTitle,
  framework,
  onChange,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSection = async () => {
    setIsGenerating(true);
    try {
      const generated = await generatePolicyText(title, policyTitle, framework);
      onChange(sectionKey, generated);
      
      toast({
        title: 'Section generated',
        description: `The ${title} section has been updated with AI-generated content.`,
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

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={(e) => onChange(sectionKey, e.target.value)}
          rows={6}
          className="resize-none"
        />
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={generateSection}
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
  );
};

export default PolicySection;

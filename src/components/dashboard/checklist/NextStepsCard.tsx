
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';

interface NextStepsCardProps {
  nextSteps: string | null;
  loading: boolean;
  complianceScore: number;
}

const NextStepsCard: React.FC<NextStepsCardProps> = ({ nextSteps, loading, complianceScore }) => {
  // Format the next steps text - split by numbered points if possible
  const formatNextSteps = (text: string): JSX.Element[] => {
    // Look for numbered lists like "1. ...", "2. ...", etc.
    if (/^\d+\.\s/.test(text.split('\n')[0])) {
      return text.split('\n')
        .filter(line => line.trim() !== '')
        .map((line, index) => (
          <div key={index} className="mb-2">
            {line}
          </div>
        ));
    }
    
    // If no numbered list is detected, just display as paragraphs
    return text.split('\n\n')
      .filter(para => para.trim() !== '')
      .map((para, index) => (
        <p key={index} className="mb-2">
          {para}
        </p>
      ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">AI-Suggested Next Steps</CardTitle>
        </div>
        <CardDescription>
          Based on your current progress ({complianceScore}% complete)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Generating personalized recommendations...</span>
          </div>
        ) : nextSteps ? (
          <div className="text-sm space-y-1 leading-relaxed">
            {formatNextSteps(nextSteps)}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recommendations available yet.</p>
            <p className="text-sm">Complete your onboarding to get personalized next steps.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NextStepsCard;

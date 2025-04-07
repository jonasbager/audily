
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck } from 'lucide-react';
import { useComplianceStatus } from '@/hooks/useOnboarding';

const DashboardComplianceScore: React.FC = () => {
  const { data: complianceScore, isLoading } = useComplianceStatus();
  
  if (isLoading) {
    return (
      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Overall Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Overall Readiness
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="text-4xl font-bold">{complianceScore}%</div>
            <div className="text-sm text-muted-foreground">
              {complianceScore < 50 
                ? "Getting started" 
                : complianceScore < 80 
                  ? "Making progress" 
                  : "Almost there!"}
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={complianceScore} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not Ready</span>
              <span>Ready for Audit</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardComplianceScore;

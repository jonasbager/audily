
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardComplianceScore from './DashboardComplianceScore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, ChevronRight, Plus, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useOnboardingProfile, useRecommendedTasks } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';
import { generateNextSteps } from '@/utils/policyGenerator';
import { useComplianceStatus } from '@/hooks/useOnboarding';
import { usePolicies } from '@/hooks/usePolicies';
import ChecklistCard from './checklist/ChecklistCard';
import NextStepsCard from './checklist/NextStepsCard';

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: complianceScore, isLoading: scoreLoading } = useComplianceStatus();
  const { data: onboardingData, isLoading: onboardingLoading } = useOnboardingProfile();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: policies } = usePolicies();
  const { data: recommendedTasks, isLoading: recommendedLoading } = useRecommendedTasks();
  const [nextSteps, setNextSteps] = useState<string | null>(null);
  const [loadingNextSteps, setLoadingNextSteps] = useState(false);

  // Determine the user's compliance type from onboarding data
  const complianceType = onboardingData?.compliance_framework?.toUpperCase() || 'COMPLIANCE';
  
  useEffect(() => {
    // If onboarding is not complete, redirect to onboarding
    if (!onboardingLoading && user && !onboardingData?.profile_complete) {
      navigate('/onboarding');
    }
  }, [user, onboardingData, onboardingLoading, navigate]);

  useEffect(() => {
    // Generate next steps based on compliance score and framework
    const fetchNextSteps = async () => {
      if (complianceScore !== undefined && onboardingData?.compliance_framework) {
        setLoadingNextSteps(true);
        try {
          const nextStepsText = await generateNextSteps(
            complianceScore, 
            onboardingData.compliance_framework
          );
          setNextSteps(nextStepsText);
        } catch (error) {
          console.error('Failed to generate next steps:', error);
        } finally {
          setLoadingNextSteps(false);
        }
      }
    };

    fetchNextSteps();
  }, [complianceScore, onboardingData]);

  // Calculate checklist stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'done').length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress').length || 0;
  const pendingTasks = tasks?.filter(task => task.status === 'todo').length || 0;

  // Calculate policy stats
  const totalPolicies = policies?.length || 0;
  const draftPolicies = policies?.filter(policy => policy.status === 'draft').length || 0;
  const publishedPolicies = policies?.filter(policy => policy.status === 'published').length || 0;

  const isLoading = scoreLoading || onboardingLoading || tasksLoading || recommendedLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your {complianceType} Audit Readiness Journey</h1>
        <p className="text-muted-foreground">
          Complete your checklist tasks to improve your compliance readiness
        </p>
      </div>

      {/* Progress Overview Card */}
      <DashboardComplianceScore />

      {/* Checklist Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Checklist Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{totalTasks} Tasks</span>
                <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
                  View All
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    <CheckCircle2 className="inline h-4 w-4 text-green-500 mr-1" />
                    {completedTasks} Completed
                  </span>
                  <span>{Math.round((completedTasks / totalTasks) * 100) || 0}%</span>
                </div>
                <Progress value={(completedTasks / totalTasks) * 100 || 0} className="h-1" />
                
                <div className="flex justify-between text-sm">
                  <span>
                    <Clock className="inline h-4 w-4 text-yellow-500 mr-1" />
                    {inProgressTasks} In Progress
                  </span>
                  <span>{Math.round((inProgressTasks / totalTasks) * 100) || 0}%</span>
                </div>
                <Progress value={(inProgressTasks / totalTasks) * 100 || 0} className="h-1" />
                
                <div className="flex justify-between text-sm">
                  <span>
                    <AlertCircle className="inline h-4 w-4 text-gray-500 mr-1" />
                    {pendingTasks} Pending
                  </span>
                  <span>{Math.round((pendingTasks / totalTasks) * 100) || 0}%</span>
                </div>
                <Progress value={(pendingTasks / totalTasks) * 100 || 0} className="h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Policies Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{totalPolicies} Policies</span>
                <Button variant="outline" size="sm" onClick={() => navigate('/policies')}>
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-muted rounded-md text-center">
                  <div className="text-2xl font-bold">{publishedPolicies}</div>
                  <div className="text-xs text-muted-foreground">Published</div>
                </div>
                <div className="p-3 bg-muted rounded-md text-center">
                  <div className="text-2xl font-bold">{draftPolicies}</div>
                  <div className="text-xs text-muted-foreground">Drafts</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => navigate('/policies/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Policy
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Risk Assessment Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
            {onboardingData?.compliance_framework?.toLowerCase() === 'nis2' ? (
              <CardDescription>Required for NIS2 compliance</CardDescription>
            ) : (
              <CardDescription>Optional but recommended</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm">
                  Identify and document your organization's key risks related to 
                  {onboardingData?.compliance_framework ? ` ${onboardingData.compliance_framework.toUpperCase()}` : ' compliance'}.
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => navigate('/risk-assessment')}
              >
                Start Risk Assessment
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Checklist */}
      <ChecklistCard />
      
      {/* Next Steps Card - AI Generated */}
      <NextStepsCard 
        nextSteps={nextSteps} 
        loading={loadingNextSteps} 
        complianceScore={complianceScore || 0}
      />
    </div>
  );
};

export default DashboardOverview;

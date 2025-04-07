import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import DashboardComplianceScore from './DashboardComplianceScore';
import { usePolicies } from '@/hooks/usePolicies';
import { useTasks } from '@/hooks/useTasks';

const TaskStatusCard = () => {
  const { data: tasks, isLoading } = useTasks();
  
  const taskData = React.useMemo(() => {
    if (!tasks) return [
      { name: 'Completed', value: 0, color: 'bg-success' },
      { name: 'In Progress', value: 0, color: 'bg-warning' },
      { name: 'Not Started', value: 0, color: 'bg-destructive' },
    ];
    
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const notStarted = tasks.filter(task => task.status === 'todo').length;
    
    return [
      { name: 'Completed', value: completed, color: 'bg-success' },
      { name: 'In Progress', value: inProgress, color: 'bg-warning' },
      { name: 'Not Started', value: notStarted, color: 'bg-destructive' },
    ];
  }, [tasks]);

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Task Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={taskData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip 
                formatter={(value) => [`${value} tasks`, '']}
                labelFormatter={() => ''}
              />
              <Bar 
                dataKey="value" 
                fill="var(--primary)" 
                radius={4}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center">
          <Link to="/tasks" className="text-sm text-primary hover:underline inline-flex items-center">
            View All Tasks
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const PolicyStatusCard = () => {
  const { data: policies, isLoading } = usePolicies();
  
  const policyData = React.useMemo(() => {
    if (!policies) return {
      complete: 0,
      total: 0,
      policies: []
    };
    
    const complete = policies.filter(policy => policy.status === 'complete').length;
    const total = policies.length;
    
    const recentPolicies = [...policies]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 7)
      .map(policy => ({
        name: policy.title,
        complete: policy.status === 'complete'
      }));
    
    return {
      complete,
      total,
      policies: recentPolicies
    };
  }, [policies]);

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-5 w-5 text-primary" />
          Policy Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">{policyData.complete}/{policyData.total}</div>
          <div className="text-sm text-muted-foreground">Policies Complete</div>
        </div>
        <div className="space-y-4">
          {policyData.policies.map((policy, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="text-sm">{policy.name}</div>
              {policy.complete ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <Clock className="h-4 w-4 text-warning" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/policies" className="text-sm text-primary hover:underline inline-flex items-center">
            View All Policies
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const RiskCard = () => {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertCircle className="h-5 w-5 text-primary" />
          Open Risks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { name: 'Missing MFA for privileged accounts', level: 'High' },
            { name: 'Incomplete supply chain security controls', level: 'Medium' },
            { name: 'No security awareness training', level: 'Medium' },
          ].map((risk, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-secondary rounded-md">
              <div className="text-sm">{risk.name}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                risk.level === 'High' ? 'bg-destructive text-destructive-foreground' :
                risk.level === 'Medium' ? 'bg-warning text-warning-foreground' :
                'bg-info text-info-foreground'
              }`}>
                {risk.level}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const NextActionCard = () => {
  return (
    <Card className="card-shadow border-2 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Next Best Action
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-primary/10 rounded-md">
          <h4 className="font-medium mb-2">Complete Security Measures Documentation</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Document the security measures implemented across your organization.
            This is required for NIS2 Article 21 compliance or SOX Section 404.
          </p>
          <Link 
            to="/tasks" 
            className="text-sm text-primary font-medium hover:underline inline-flex items-center"
          >
            Go to task
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardComplianceScore />
        <TaskStatusCard />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PolicyStatusCard />
        <RiskCard />
      </div>
      
      <NextActionCard />
    </div>
  );
};

export default DashboardOverview;

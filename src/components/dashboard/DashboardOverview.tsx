
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const ComplianceScoreCard = () => {
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
            <div className="text-4xl font-bold">67%</div>
            <div className="text-sm text-muted-foreground">+12% this month</div>
          </div>
          <div className="space-y-2">
            <Progress value={67} className="h-2" />
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

const TaskStatusCard = () => {
  const tasks = [
    { name: 'Completed', value: 18, color: 'bg-success' },
    { name: 'In Progress', value: 7, color: 'bg-warning' },
    { name: 'Not Started', value: 12, color: 'bg-destructive' },
  ];

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
              data={tasks}
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
          <div className="text-2xl font-bold">4/7</div>
          <div className="text-sm text-muted-foreground">Policies Complete</div>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Access Control', complete: true },
            { name: 'Incident Response', complete: true },
            { name: 'Password Management', complete: true },
            { name: 'Business Continuity', complete: true },
            { name: 'Change Management', complete: false },
            { name: 'Risk Assessment', complete: false },
            { name: 'Vendor Management', complete: false },
          ].map((policy) => (
            <div key={policy.name} className="flex justify-between items-center">
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
            { name: 'Missing MFA for admin accounts', level: 'High' },
            { name: 'Incomplete offboarding process', level: 'Medium' },
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
          <h4 className="font-medium mb-2">Complete Access Control Matrix</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Document who has access to which systems and what level of permissions they have.
            This is required for SOC 2 Common Criteria CC6.3.
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
        <ComplianceScoreCard />
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

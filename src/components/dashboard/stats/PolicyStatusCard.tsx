
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { usePolicies } from '@/hooks/usePolicies';

const PolicyStatusCard: React.FC = () => {
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

export default PolicyStatusCard;

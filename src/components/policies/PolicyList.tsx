
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePolicies } from '@/hooks/usePolicies';
import { Policy } from '@/services/policyService';
import { Skeleton } from '@/components/ui/skeleton';

const PolicyStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'complete':
      return (
        <Badge className="bg-success text-success-foreground">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Complete
        </Badge>
      );
    case 'draft':
      return (
        <Badge className="bg-warning text-warning-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Draft
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          Not Started
        </Badge>
      );
  }
};

const PolicyList: React.FC = () => {
  const { data: policies, isLoading } = usePolicies();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Policies</h1>
        </div>
        
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-shadow">
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Policies</h1>
        <Button asChild>
          <Link to="/policies/new">
            <Plus className="h-4 w-4 mr-2" />
            New Policy
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4">
        {policies && policies.length > 0 ? (
          policies.map((policy: Policy) => (
            <Card key={policy.id} className="card-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {policy.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{policy.description}</CardDescription>
                </div>
                <PolicyStatusBadge status={policy.status} />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Framework: {policy.framework.toUpperCase()}
                    <span className="mx-2">•</span>
                    Last updated: {new Date(policy.updated_at).toLocaleDateString()}
                  </div>
                  <Link 
                    to={`/policies/${policy.id}`}
                    className="text-sm font-medium text-primary hover:underline inline-flex items-center"
                  >
                    {policy.status === 'not-started' ? 'Generate Policy' : 'View Policy'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="card-shadow p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No policies yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first policy to get started with compliance management
              </p>
              <Button asChild>
                <Link to="/policies/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Policy
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PolicyList;

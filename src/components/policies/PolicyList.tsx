
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
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Policy {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'draft' | 'not-started';
  lastUpdated?: string;
}

const policies: Policy[] = [
  {
    id: 'access-control',
    name: 'Access Control Policy',
    description: 'Defines how access to systems and data is managed',
    status: 'complete',
    lastUpdated: '2025-03-15',
  },
  {
    id: 'incident-response',
    name: 'Incident Response Policy',
    description: 'Outlines procedures for security incidents',
    status: 'complete',
    lastUpdated: '2025-03-10',
  },
  {
    id: 'password-management',
    name: 'Password Management Policy',
    description: 'Standards for password creation and management',
    status: 'complete',
    lastUpdated: '2025-03-01',
  },
  {
    id: 'business-continuity',
    name: 'Business Continuity Plan',
    description: 'Procedures to maintain operations during disruptions',
    status: 'complete',
    lastUpdated: '2025-02-20',
  },
  {
    id: 'change-management',
    name: 'Change Management Policy',
    description: 'Process for requesting and implementing changes',
    status: 'draft',
    lastUpdated: '2025-03-20',
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Policy',
    description: 'Framework for identifying and assessing risks',
    status: 'not-started',
  },
  {
    id: 'vendor-management',
    name: 'Vendor Management Policy',
    description: 'Requirements for vendor security assessments',
    status: 'not-started',
  },
];

const PolicyStatusBadge: React.FC<{ status: Policy['status'] }> = ({ status }) => {
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
    case 'not-started':
      return (
        <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          Not Started
        </Badge>
      );
  }
};

const PolicyList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Policies</h1>
      </div>
      
      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id} className="card-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {policy.name}
                </CardTitle>
                <CardDescription>{policy.description}</CardDescription>
              </div>
              <PolicyStatusBadge status={policy.status} />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {policy.lastUpdated 
                    ? `Last updated: ${policy.lastUpdated}` 
                    : 'Not started yet'}
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
        ))}
      </div>
    </div>
  );
};

export default PolicyList;

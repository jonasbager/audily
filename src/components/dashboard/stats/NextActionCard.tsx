
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NextActionCard: React.FC = () => {
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
          <p className="text-sm text-muted-foreground mb-2">
            Document the security measures implemented across your organization.
            This is required for NIS2 Article 21 compliance or SOX Section 404.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Assigned to you</span>
            </Badge>
          </div>
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

export default NextActionCard;

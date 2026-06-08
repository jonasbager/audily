import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronRight } from 'lucide-react';

/**
 * Open Risks card.
 *
 * Risk data lives in the (forthcoming) risk_assessment table. Until that
 * query is wired up we intentionally render an empty state instead of mock
 * risks — the dashboard MUST only show real data.
 */
const RiskCard: React.FC = () => {
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertCircle className="h-5 w-5 text-primary" />
          Open Risks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4 text-sm text-muted-foreground">
          <p className="mb-3">No risks identified yet.</p>
          <Button asChild size="sm" variant="outline">
            <Link to="/risk-assessment">
              Run Risk Assessment
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskCard;

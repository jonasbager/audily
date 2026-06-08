import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { useRiskAssessments } from '@/hooks/useRiskAssessments';

const severityVariant: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const RiskCard: React.FC = () => {
  const { data: risks, isLoading } = useRiskAssessments();

  const openRisks = (risks ?? []).filter((r) => r.status === 'open');
  const topRisks = openRisks.slice(0, 3);

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertCircle className="h-5 w-5 text-primary" />
          Open Risks
        </CardTitle>
        {openRisks.length > 0 && (
          <span className="text-sm text-muted-foreground">{openRisks.length} open</span>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-2">Loading…</div>
        ) : topRisks.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <p className="mb-3">No risks identified yet.</p>
            <Button asChild size="sm" variant="outline">
              <Link to="/risk-assessment">
                Run Risk Assessment
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {topRisks.map((risk) => (
              <div key={risk.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{risk.title}</p>
                  {risk.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {risk.description}
                    </p>
                  )}
                </div>
                <Badge className={severityVariant[risk.severity] ?? ''} variant="secondary">
                  {risk.severity}
                </Badge>
              </div>
            ))}
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link to="/risk-assessment">
                View all risks
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskCard;

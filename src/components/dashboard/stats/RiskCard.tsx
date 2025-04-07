
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

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

export default RiskCard;

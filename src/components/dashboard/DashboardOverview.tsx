
import React from 'react';
import DashboardComplianceScore from './DashboardComplianceScore';
import DashboardRecentEvidence from './DashboardRecentEvidence';
import TaskStatusCard from './stats/TaskStatusCard';
import PolicyStatusCard from './stats/PolicyStatusCard';
import RiskCard from './stats/RiskCard';
import NextActionCard from './stats/NextActionCard';

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
        <DashboardRecentEvidence />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskCard />
        <NextActionCard />
      </div>
    </div>
  );
};

export default DashboardOverview;

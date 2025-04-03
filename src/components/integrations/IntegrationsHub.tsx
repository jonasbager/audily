
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  ArrowRight,
  UserCheck,
  Shield,
  HardDrive,
  MessageSquare,
  Github,
  Cloud
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'not-connected';
  lastSync?: string;
  stats?: string;
}

const integrations: Integration[] = [
  {
    id: 'google',
    name: 'Google Workspace',
    description: 'Connect to audit user accounts, security settings, and access controls.',
    icon: <Cloud className="h-8 w-8 text-primary" />,
    status: 'connected',
    lastSync: '2025-04-02 09:32 AM',
    stats: 'Found 27 users, 5 admin accounts'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Audit repository access, branch protection, and security settings.',
    icon: <Github className="h-8 w-8 text-primary" />,
    status: 'connected',
    lastSync: '2025-04-02 10:15 AM',
    stats: 'Found 12 repositories, 8 with branch protection'
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Monitor IAM users, security groups, and S3 bucket permissions.',
    icon: <Cloud className="h-8 w-8 text-primary" />,
    status: 'not-connected',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Review workspace settings, member access, and data retention.',
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    status: 'not-connected',
  },
];

const IntegrationCard: React.FC<{ integration: Integration }> = ({ integration }) => {
  const { toast } = useToast();
  
  const handleConnect = () => {
    toast({
      title: 'Integration started',
      description: `Connecting to ${integration.name}...`,
    });
  };
  
  const handleRefresh = () => {
    toast({
      title: 'Refreshing data',
      description: `Synchronizing with ${integration.name}...`,
    });
  };
  
  const handleDisconnect = () => {
    toast({
      title: 'Integration disconnected',
      description: `${integration.name} has been disconnected.`,
    });
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            {integration.icon}
            <span>{integration.name}</span>
            {integration.status === 'connected' ? (
              <Badge className="ml-2 bg-success text-success-foreground">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="ml-2">
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{integration.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {integration.status === 'connected' && (
          <div className="space-y-2 bg-muted p-3 rounded-md">
            <div className="text-sm flex justify-between">
              <span className="text-muted-foreground">Last synced:</span>
              <span>{integration.lastSync}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{integration.stats}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {integration.status === 'connected' ? (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleDisconnect}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            size="sm"
            onClick={handleConnect}
          >
            Connect
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const IntegrationsHub: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Integrations</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map(integration => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
      
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Why Connect Integrations?</CardTitle>
          <CardDescription>
            Integrations help automate evidence collection and compliance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 rounded-md">
              <UserCheck className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Automatically track user access, permissions, and offboarding
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-md">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">Security Settings</h3>
              <p className="text-sm text-muted-foreground">
                Monitor MFA enforcement, password policies, and security controls
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-md">
              <HardDrive className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">Evidence Collection</h3>
              <p className="text-sm text-muted-foreground">
                Gather compliance evidence without manual screenshots
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsHub;

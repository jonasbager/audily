
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Github, 
  Slack, 
  FileText, 
  CloudCog, 
  Database, 
  Server,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useIntegrations, useCreateIntegration, useDeleteIntegration } from '@/hooks/useIntegrations';
import { Skeleton } from '@/components/ui/skeleton';

// Type definitions
interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  connected?: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
}

interface IntegrationFormProps {
  serviceName: string;
  onSubmit: (serviceId: string, accessToken: string) => void;
  onCancel: () => void;
}

// Integration Card Component
const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  connected = false,
  onConnect,
  onDisconnect
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
          {connected && (
            <div className="flex items-center text-sm text-green-600 font-medium">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Connected
            </div>
          )}
        </div>
        <CardTitle className="mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        {connected ? (
          <Button variant="outline" onClick={onDisconnect} className="w-full">
            Disconnect
          </Button>
        ) : (
          <Button onClick={onConnect} className="w-full">
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Integration Form Component
const IntegrationForm: React.FC<IntegrationFormProps> = ({ serviceName, onSubmit, onCancel }) => {
  const [serviceId, setServiceId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceId.trim() && accessToken.trim()) {
      onSubmit(serviceId, accessToken);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="serviceId">Service ID or Username</Label>
        <Input
          id="serviceId"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          placeholder="Enter your service ID"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="accessToken">API Key / Access Token</Label>
        <Input
          id="accessToken"
          type="password"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Enter your access token"
          required
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Connect
        </Button>
      </div>
    </form>
  );
};

// Main IntegrationsHub Component
const IntegrationsHub: React.FC = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { data: integrations, isLoading } = useIntegrations();
  const createIntegrationMutation = useCreateIntegration();
  const deleteIntegrationMutation = useDeleteIntegration();
  
  const handleOpenIntegrationForm = (serviceName: string) => {
    setSelectedIntegration(serviceName);
    setIsDialogOpen(true);
  };
  
  const handleCloseIntegrationForm = () => {
    setSelectedIntegration(null);
    setIsDialogOpen(false);
  };
  
  const handleConnectIntegration = (serviceId: string, accessToken: string) => {
    if (!selectedIntegration) return;
    
    createIntegrationMutation.mutate({
      service_name: selectedIntegration,
      service_id: serviceId,
      access_token: accessToken
    }, {
      onSuccess: () => {
        toast({
          title: "Integration successful",
          description: `Connected to ${selectedIntegration} successfully.`
        });
        handleCloseIntegrationForm();
      }
    });
  };
  
  const handleDisconnectIntegration = (integrationId: string, serviceName: string) => {
    deleteIntegrationMutation.mutate(integrationId, {
      onSuccess: () => {
        toast({
          title: "Integration removed",
          description: `${serviceName} has been disconnected.`
        });
      }
    });
  };
  
  const findConnectedIntegration = (serviceName: string) => {
    return integrations?.find(integration => 
      integration.service_name === serviceName && integration.status === 'active'
    );
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-3/4 mt-4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  const availableIntegrations = [
    {
      name: "github",
      title: "GitHub",
      description: "Connect your GitHub repositories for audit trail of code changes.",
      icon: <Github className="h-6 w-6" />
    },
    {
      name: "slack",
      title: "Slack",
      description: "Get notifications and updates directly in your Slack workspace.",
      icon: <Slack className="h-6 w-6" />
    },
    {
      name: "google_drive",
      title: "Google Drive",
      description: "Store and retrieve evidence documents from Google Drive.",
      icon: <FileText className="h-6 w-6" />
    },
    {
      name: "aws",
      title: "AWS",
      description: "Connect to AWS services for cloud resource compliance monitoring.",
      icon: <CloudCog className="h-6 w-6" />
    },
    {
      name: "jira",
      title: "Jira",
      description: "Sync compliance tasks with Jira tickets for streamlined workflows.",
      icon: <Server className="h-6 w-6" />
    },
    {
      name: "azure",
      title: "Azure",
      description: "Connect to Microsoft Azure for cloud compliance monitoring.",
      icon: <Database className="h-6 w-6" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Integration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableIntegrations.map((integration) => {
          const connectedIntegration = findConnectedIntegration(integration.name);
          
          return (
            <IntegrationCard
              key={integration.name}
              title={integration.title}
              description={integration.description}
              icon={integration.icon}
              connected={!!connectedIntegration}
              onConnect={() => handleOpenIntegrationForm(integration.name)}
              onDisconnect={connectedIntegration 
                ? () => handleDisconnectIntegration(connectedIntegration.id, integration.title)
                : undefined
              }
            />
          );
        })}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedIntegration && 
                `Connect to ${availableIntegrations.find(i => i.name === selectedIntegration)?.title}`
              }
            </DialogTitle>
            <DialogDescription>
              Enter your credentials to connect this service to your account.
            </DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <IntegrationForm 
              serviceName={selectedIntegration}
              onSubmit={handleConnectIntegration}
              onCancel={handleCloseIntegrationForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationsHub;

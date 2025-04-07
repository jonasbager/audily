
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, User, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks, useCreateTask } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const NextActionCard: React.FC = () => {
  const { data: tasks } = useTasks();
  const createTask = useCreateTask();
  const { toast } = useToast();
  const { user } = useAuth();
  const [securityTask, setSecurityTask] = useState<string | null>(null);
  
  useEffect(() => {
    // Find an existing security documentation task
    const existingSecurityTask = tasks?.find(task => 
      task.title.toLowerCase().includes('security') && 
      task.title.toLowerCase().includes('documentation')
    );
    
    if (existingSecurityTask) {
      setSecurityTask(existingSecurityTask.id);
    }
  }, [tasks]);
  
  const createSecurityTask = () => {
    createTask.mutate({
      title: "Complete Security Measures Documentation",
      description: "Document the security measures implemented across your organization. This is required for NIS2 Article 21 compliance or SOX Section 404.",
      status: "todo",
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    }, {
      onSuccess: (data) => {
        if (data) {
          setSecurityTask(data.id);
          toast({
            title: "Task created",
            description: "Security documentation task has been created"
          });
        }
      }
    });
  };

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
          
          {securityTask ? (
            <Link 
              to={`/tasks?taskId=${securityTask}`}
              className="text-sm text-primary font-medium hover:underline inline-flex items-center"
            >
              Go to task
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          ) : (
            <Button 
              size="sm"
              onClick={createSecurityTask}
              disabled={createTask.isPending}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> 
              {createTask.isPending ? "Creating task..." : "Create this task"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NextActionCard;

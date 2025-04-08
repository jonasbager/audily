
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, ChevronRight, CheckCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { useRecommendedTasks } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

const ChecklistCard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: recommendedTasks, isLoading: recommendedLoading } = useRecommendedTasks();
  const updateTaskMutation = useUpdateTask();
  const [expandedView, setExpandedView] = useState(false);
  
  // Merge actual tasks and recommended tasks
  const allTasks = React.useMemo(() => {
    const existingTasks = tasks || [];
    
    // If there are recommended tasks and actual tasks count is low, show recommendations
    if (recommendedTasks && recommendedTasks.length > 0 && existingTasks.length < 10) {
      // Filter out recommended tasks that might already exist
      const existingTitles = new Set(existingTasks.map(task => task.title.toLowerCase()));
      const filteredRecommendations = recommendedTasks
        .filter(rec => !existingTitles.has(rec.title.toLowerCase()))
        .slice(0, 5) // Limit to 5 recommendations
        .map(rec => ({
          id: `rec-${rec.title.replace(/\s/g, '-').toLowerCase()}`,
          title: rec.title,
          description: rec.description,
          status: 'recommended',
          priority: rec.priority,
          category: rec.category,
          isRecommendation: true
        }));
      
      return [...existingTasks, ...filteredRecommendations];
    }
    
    return existingTasks;
  }, [tasks, recommendedTasks]);
  
  const priorityTasks = allTasks
    .filter(task => task.status !== 'done')
    .slice(0, expandedView ? 10 : 5);
  
  const handleTaskStatusChange = (taskId: string, currentStatus: string) => {
    // Skip if this is a recommendation
    if (taskId.startsWith('rec-')) {
      navigate('/tasks', { state: { createRecommendation: taskId.substring(4) } });
      return;
    }
    
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    
    updateTaskMutation.mutate({
      id: taskId,
      updates: { status: newStatus }
    }, {
      onSuccess: () => {
        toast({
          title: newStatus === 'done' ? "Task completed" : "Task reopened",
          description: newStatus === 'done' 
            ? "Great job! Task marked as complete." 
            : "Task has been reopened.",
        });
      }
    });
  };
  
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCheck className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'recommended':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };
  
  if (tasksLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Compliance Checklist</CardTitle>
          <CardDescription>Tasks to complete for your audit readiness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4 py-3 border-b">
                <Skeleton className="h-5 w-5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Compliance Checklist</CardTitle>
            <CardDescription>Tasks to complete for your audit readiness</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/tasks')}
          >
            View All Tasks
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {priorityTasks.length > 0 ? (
          <div className="space-y-2">
            {priorityTasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-start space-x-4 p-3 hover:bg-muted rounded-md transition-colors"
              >
                <div className="pt-0.5">
                  <Checkbox
                    checked={task.status === 'done'}
                    disabled={task.isRecommendation || updateTaskMutation.isPending}
                    onCheckedChange={() => handleTaskStatusChange(task.id, task.status)}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {task.priority && getPriorityBadge(task.priority)}
                      {task.isRecommendation && (
                        <Badge variant="secondary">Recommended</Badge>
                      )}
                      {getTaskStatusIcon(task.status)}
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description.length > 100
                        ? `${task.description.substring(0, 100)}...`
                        : task.description}
                    </p>
                  )}
                  
                  {task.isRecommendation && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto mt-1 text-primary"
                      onClick={() => handleTaskStatusChange(task.id, task.status)}
                    >
                      Add to my tasks
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {allTasks.length > 5 && (
              <Button 
                variant="ghost" 
                className="w-full text-sm" 
                onClick={() => setExpandedView(!expandedView)}
              >
                {expandedView ? 'Show less tasks' : `Show more tasks (${allTasks.length - 5} more)`}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No tasks found in your checklist</p>
            <Button
              onClick={() => navigate('/tasks')}
            >
              Create Your First Task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChecklistCard;

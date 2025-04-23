import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  User, 
  CalendarClock,
  FileUp,
  Plus,
  UserPlus,
  Edit,
  ChevronRight,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTasks, useUpdateTask, useCreateTask } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { Task } from '@/services/taskService';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import CreateTaskDialog from './CreateTaskDialog';
import TaskEvidenceUploader from './TaskEvidenceUploader';
import EditTaskDialog from './EditTaskDialog';

const CategorySelect = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Security', label: 'Security' },
    { value: 'Availability', label: 'Availability' },
    { value: 'Processing Integrity', label: 'Processing Integrity' },
    { value: 'Confidentiality', label: 'Confidentiality' },
    { value: 'Privacy', label: 'Privacy' },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const StatusSelect = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const TaskStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'done':
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Done
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-yellow-500 text-white">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
    case 'todo':
    default:
      return (
        <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          To Do
        </Badge>
      );
  }
};

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, status: string) => void;
  highlighted?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onStatusChange,
  highlighted = false 
}) => {
  const { toast } = useToast();
  const { data: teamMembers } = useTeamMembers();
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const updateTaskMutation = useUpdateTask();
  
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };
  
  const getAssigneeName = () => {
    if (!task.assigned_to) return 'Unassigned';
    if (task.assignee_name) return task.assignee_name;
    if (task.assignee_email) return task.assignee_email;
    return 'Team Member';
  };
  
  const handleStatusToggle = () => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    onStatusChange(task.id, newStatus);
  };
  
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(task.id, newStatus);
  };
  
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({
      id: taskId,
      updates
    }, {
      onSuccess: () => {
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
      }
    });
  };
  
  return (
    <div 
      id={`task-${task.id}`}
      className={`mb-4 p-4 border rounded-md ${highlighted ? 'bg-primary/5 border-primary animate-pulse' : 'bg-card'}`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <Checkbox
            checked={task.status === 'done'}
            onCheckedChange={handleStatusToggle}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className={`text-base font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <TaskStatusBadge status={task.status} />
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {getAssigneeName()}
            </div>
            
            {task.due_date && (
              <div className="flex items-center gap-1">
                <CalendarClock className="h-3 w-3" />
                Due: {formatDueDate(task.due_date)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowEvidenceDialog(true)}
        >
          <FileUp className="h-3 w-3 mr-1" />
          Upload Evidence
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEditDialog(true)}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit Task
        </Button>
        
        <Select
          value={task.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {showEvidenceDialog && (
        <div className="mt-4 p-4 border rounded-md">
          <TaskEvidenceUploader 
            taskId={task.id} 
            onClose={() => setShowEvidenceDialog(false)} 
          />
        </div>
      )}
      
      {showEditDialog && (
        <EditTaskDialog
          task={showEditDialog ? task : null}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={handleUpdateTask}
        />
      )}
    </div>
  );
};

const TaskGroupAccordion: React.FC<{
  title: string;
  description?: string;
  tasks: Task[];
  onStatusChange: (taskId: string, status: string) => void;
  highlightedTaskId?: string | null;
}> = ({ title, description, tasks, onStatusChange, highlightedTaskId }) => {
  if (tasks.length === 0) return null;
  
  const completedCount = tasks.filter(task => task.status === 'done').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  
  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value="tasks" className="border rounded-md">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex-1 text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">{title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {completedCount} of {tasks.length} complete
                </span>
                <Badge variant={progressPercent === 100 ? "default" : "outline"} className={progressPercent === 100 ? "bg-green-500 hover:bg-green-600" : ""}>
                  {progressPercent}%
                </Badge>
              </div>
            </div>
            
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            
            <div className="mt-2">
              <Progress value={progressPercent} className="h-1" />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2 pb-3">
          <div className="space-y-1">
            {tasks.map((task) => (
              <TaskItem 
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                highlighted={highlightedTaskId === task.id}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const TaskList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const taskId = searchParams.get('taskId');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: tasks, isLoading, error } = useTasks();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const updateTaskMutation = useUpdateTask();
  const createTaskMutation = useCreateTask();
  
  useEffect(() => {
    const state = location.state as { createRecommendation?: string } | null;
    if (state?.createRecommendation) {
      const recommendationId = state.createRecommendation;
      navigate(location.pathname, { replace: true });
      setCreateDialogOpen(true);
    }
  }, [location, navigate]);
  
  const filteredTasks = tasks?.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesStatus;
  }) || [];
  
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');
  
  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    updateTaskMutation.mutate({
      id: taskId,
      updates: { status: newStatus }
    }, {
      onSuccess: () => {
        toast({
          title: newStatus === 'done' ? "Task completed" : "Task status updated",
          description: newStatus === 'done' 
            ? "Great job! Task marked as complete." 
            : `Task status updated to ${newStatus.replace('_', ' ')}.`,
        });
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Compliance Checklist</h1>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Compliance Checklist</h1>
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error loading your checklist items. Please try again later.</p>
            <Button variant="outline" className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Compliance Checklist</h1>
          <p className="text-muted-foreground">
            Track and document your compliance activities
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Checklist Item
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm mr-2">Show:</span>
        </div>
        <StatusSelect value={statusFilter} onChange={setStatusFilter} />
      </div>
      
      <div className="space-y-6">
        {todoTasks.length > 0 && (
          <TaskGroupAccordion
            title="To Do"
            description="Tasks that need to be started"
            tasks={todoTasks}
            onStatusChange={handleTaskStatusChange}
            highlightedTaskId={taskId}
          />
        )}
        
        {inProgressTasks.length > 0 && (
          <TaskGroupAccordion
            title="In Progress"
            description="Tasks currently being worked on"
            tasks={inProgressTasks}
            onStatusChange={handleTaskStatusChange}
            highlightedTaskId={taskId}
          />
        )}
        
        {doneTasks.length > 0 && (
          <TaskGroupAccordion
            title="Completed"
            description="Tasks that have been finished"
            tasks={doneTasks}
            onStatusChange={handleTaskStatusChange}
            highlightedTaskId={taskId}
          />
        )}
        
        {filteredTasks.length === 0 && (
          <div className="text-center p-8 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-4">Your checklist is empty. Add items to track your compliance progress.</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Checklist Item
            </Button>
          </div>
        )}
      </div>
      
      <CreateTaskDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </div>
  );
};

export default TaskList;

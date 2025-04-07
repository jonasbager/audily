import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  MoreHorizontal,
  Plus,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { Task } from '@/services/taskService';
import { Skeleton } from '@/components/ui/skeleton';
import CreateTaskDialog from './CreateTaskDialog';

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
    { value: 'in-progress', label: 'In Progress' },
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
    case 'in-progress':
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

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const { toast } = useToast();
  const { data: teamMembers } = useTeamMembers();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const updateTaskMutation = useUpdateTask();
  
  const handleMarkAsComplete = () => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { status: 'done' }
    }, {
      onSuccess: () => {
        toast({
          title: "Task updated",
          description: "Task has been marked as complete.",
        });
      }
    });
  };

  const handleAssignTask = (memberId: string) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { assigned_to: memberId }
    }, {
      onSuccess: () => {
        toast({
          title: "Task assigned",
          description: "Task has been successfully assigned.",
        });
        setShowAssignDialog(false);
      }
    });
  };

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
  
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium">
            {task.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {task.description || 'No description'}
          </p>
        </div>
        <TaskStatusBadge status={task.status} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            {getAssigneeName()}
          </div>
          {task.due_date && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              Due: {formatDueDate(task.due_date)}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FileUp className="h-4 w-4 mr-2" />
                Upload Evidence
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Evidence</DialogTitle>
                <DialogDescription>
                  Upload documentation that proves this task has been completed.
                </DialogDescription>
              </DialogHeader>
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="evidence">Evidence Files</Label>
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Select Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOCX, PNG, JPG
                </p>
              </div>
              <DialogFooter>
                <Button onClick={handleMarkAsComplete}>
                  Upload and Complete Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Assign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Task</DialogTitle>
                <DialogDescription>
                  Assign this task to a team member.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="assign-to">Assign to</Label>
                <Select 
                  defaultValue={task.assigned_to || ""}
                  onValueChange={handleAssignTask}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {teamMembers?.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name || member.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMarkAsComplete}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Complete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskList: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: tasks, isLoading, error } = useTasks();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const filteredTasks = tasks?.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesStatus;
  }) || [];
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tasks</h1>
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
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error loading your tasks. Please try again later.</p>
            <Button variant="outline" className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Task
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm mr-2">Filters:</span>
        </div>
        <StatusSelect value={statusFilter} onChange={setStatusFilter} />
      </div>
      
      <div>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center p-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">No tasks match the selected filters.</p>
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

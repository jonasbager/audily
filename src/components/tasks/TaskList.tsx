
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
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
  Lightbulb,
  MoreHorizontal
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
import { Avatar } from '@/components/ui/avatar';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
  dueDate: string;
  category: string;
  requiresEvidence: boolean;
  aiSuggestion?: string;
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Configure MFA for Admin Accounts',
    description: 'Enable multi-factor authentication for all administrative accounts',
    status: 'todo',
    assignee: 'Sarah Johnson',
    dueDate: '2025-04-15',
    category: 'Security',
    requiresEvidence: true,
    aiSuggestion: 'Take screenshots of the enabled MFA settings in each admin system. Document the process in your Access Control matrix.',
  },
  {
    id: '2',
    title: 'Complete Access Control Matrix',
    description: 'Document who has access to which systems and what level of permissions they have',
    status: 'in-progress',
    assignee: 'Michael Chen',
    dueDate: '2025-04-20',
    category: 'Security',
    requiresEvidence: true,
    aiSuggestion: 'Create a spreadsheet listing all systems, users, and their access levels. Include approval processes for requesting and granting access.',
  },
  {
    id: '3',
    title: 'Implement Password Policy',
    description: 'Configure password complexity and rotation requirements',
    status: 'done',
    assignee: 'Sarah Johnson',
    dueDate: '2025-04-01',
    category: 'Security',
    requiresEvidence: true,
  },
  {
    id: '4',
    title: 'Create Incident Response Plan',
    description: 'Document procedures for handling security incidents',
    status: 'in-progress',
    assignee: 'David Wilson',
    dueDate: '2025-04-30',
    category: 'Security',
    requiresEvidence: false,
  },
  {
    id: '5',
    title: 'Set Up Backup Schedule',
    description: 'Implement regular backups of critical systems',
    status: 'todo',
    assignee: 'Michael Chen',
    dueDate: '2025-05-10',
    category: 'Availability',
    requiresEvidence: true,
    aiSuggestion: 'Configure automated backups and take screenshots of the backup schedule and success logs.',
  },
  {
    id: '6',
    title: 'Document Change Management Process',
    description: 'Create process for documenting and approving changes',
    status: 'todo',
    assignee: 'Unassigned',
    dueDate: '2025-05-15',
    category: 'Processing Integrity',
    requiresEvidence: false,
    aiSuggestion: 'Create a change request template and document the approval workflow. Include risk assessment criteria.',
  },
];

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

const TaskStatusBadge: React.FC<{ status: Task['status'] }> = ({ status }) => {
  switch (status) {
    case 'done':
      return (
        <Badge className="bg-success text-success-foreground">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Done
        </Badge>
      );
    case 'in-progress':
      return (
        <Badge className="bg-warning text-warning-foreground">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
    case 'todo':
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
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  
  const handleMarkAsComplete = () => {
    toast({
      title: 'Task updated',
      description: 'Task has been marked as complete.',
    });
  };
  
  return (
    <Card className="card-shadow mb-4">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium">
            {task.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {task.description}
          </p>
        </div>
        <TaskStatusBadge status={task.status} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            {task.assignee}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            Due: {task.dueDate}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{task.category}</Badge>
          </div>
          {task.requiresEvidence && (
            <Badge>
              <FileUp className="h-3 w-3 mr-1" />
              Evidence Required
            </Badge>
          )}
        </div>
        
        {showAISuggestion && task.aiSuggestion && (
          <div className="bg-primary/10 p-3 rounded-md mb-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm flex-1">
                <div className="font-medium mb-1">AI Suggestion</div>
                {task.aiSuggestion}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          {task.aiSuggestion && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAISuggestion(!showAISuggestion)}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {showAISuggestion ? 'Hide Suggestion' : 'Show Suggestion'}
            </Button>
          )}
          
          <div className="flex gap-2 ml-auto">
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
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Reassign Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskList: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesCategory && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button>
          Create New Task
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm mr-2">Filters:</span>
        </div>
        <CategorySelect value={categoryFilter} onChange={setCategoryFilter} />
        <StatusSelect value={statusFilter} onChange={setStatusFilter} />
      </div>
      
      <div>
        {filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center p-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">No tasks match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;

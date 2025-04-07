
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

const TaskStatusCard: React.FC = () => {
  const { data: tasks, isLoading } = useTasks();
  
  const taskData = React.useMemo(() => {
    if (!tasks) return [
      { name: 'Completed', value: 0, color: 'bg-success' },
      { name: 'In Progress', value: 0, color: 'bg-warning' },
      { name: 'Not Started', value: 0, color: 'bg-destructive' },
    ];
    
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const notStarted = tasks.filter(task => task.status === 'todo').length;
    
    return [
      { name: 'Completed', value: completed, color: 'bg-success' },
      { name: 'In Progress', value: inProgress, color: 'bg-warning' },
      { name: 'Not Started', value: notStarted, color: 'bg-destructive' },
    ];
  }, [tasks]);

  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Task Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={taskData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip 
                formatter={(value) => [`${value} tasks`, '']}
                labelFormatter={() => ''}
              />
              <Bar 
                dataKey="value" 
                fill="var(--primary)" 
                radius={4}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center">
          <Link to="/tasks" className="text-sm text-primary hover:underline inline-flex items-center">
            View All Tasks
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskStatusCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

const COLORS = ['#4ade80', '#facc15', '#f43f5e']; // success, warning, destructive colors

const TaskStatusCard: React.FC = () => {
  const { data: tasks, isLoading } = useTasks();
  
  const taskData = React.useMemo(() => {
    if (!tasks) return [
      { name: 'Completed', value: 0, color: '#4ade80' },
      { name: 'In Progress', value: 0, color: '#facc15' },
      { name: 'Not Started', value: 0, color: '#f43f5e' },
    ];
    
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const notStarted = tasks.filter(task => task.status === 'todo').length;
    
    return [
      { name: 'Completed', value: completed, color: '#4ade80' },
      { name: 'In Progress', value: inProgress, color: '#facc15' },
      { name: 'Not Started', value: notStarted, color: '#f43f5e' },
    ];
  }, [tasks]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent === 0) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
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
            <PieChart>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={70}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {taskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} tasks`, name]}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
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


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
    
    const completed = tasks.filter(task => task.status === 'done').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const notStarted = tasks.filter(task => task.status === 'todo').length;
    
    return [
      { name: 'Completed', value: completed, color: '#4ade80' },
      { name: 'In Progress', value: inProgress, color: '#facc15' },
      { name: 'Not Started', value: notStarted, color: '#f43f5e' },
    ];
  }, [tasks]);

  // Modified label renderer to position labels outside the chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    // Don't render labels for small segments or when percent is 0
    if (percent < 0.05 || percent === 0) return null;
    
    // Calculate position for the label - placing it outside the chart
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Determine text anchor based on angle
    const textAnchor = x > cx ? 'start' : 'end';
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={COLORS[index % COLORS.length]} 
        textAnchor={textAnchor}
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
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                outerRadius={60}
                innerRadius={40}
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
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
              />
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

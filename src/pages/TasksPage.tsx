
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TaskList from '@/components/tasks/TaskList';

const TasksPage: React.FC = () => {
  return (
    <AppLayout>
      <TaskList />
    </AppLayout>
  );
};

export default TasksPage;


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TaskList from '@/components/tasks/TaskList';

const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  
  useEffect(() => {
    // If there's a task ID in the URL, we could implement:
    // 1. Scroll to that task
    // 2. Highlight that task
    // 3. Open that task details
    if (taskId) {
      console.log(`Task ID from URL: ${taskId}`);
      // Future enhancement: scroll to or highlight the specific task
    }
  }, [taskId]);
  
  return (
    <AppLayout>
      <TaskList />
    </AppLayout>
  );
};

export default TasksPage;

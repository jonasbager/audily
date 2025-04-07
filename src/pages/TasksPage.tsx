
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TaskList from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/useTasks';

const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  const { data: tasks, isLoading } = useTasks();
  
  useEffect(() => {
    // If there's a task ID in the URL, we could implement:
    // 1. Scroll to that task
    // 2. Highlight that task
    // 3. Open that task details
    if (taskId) {
      console.log(`Task ID from URL: ${taskId}`);
      
      // Find the task element in the DOM and scroll to it
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Could also add a highlight class
        taskElement.classList.add('highlight-task');
        
        // Remove highlight after a few seconds
        setTimeout(() => {
          taskElement.classList.remove('highlight-task');
        }, 3000);
      }
    }
  }, [taskId, tasks]);
  
  return (
    <AppLayout>
      <TaskList />
    </AppLayout>
  );
};

export default TasksPage;

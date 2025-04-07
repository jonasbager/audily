
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchTasks, 
  fetchTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  TaskInput
} from "@/services/taskService";
import { useAuth } from "@/hooks/useAuth";

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => id ? fetchTaskById(id) : null,
    enabled: !!id
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (task: Omit<TaskInput, "user_id">) => {
      if (!user) throw new Error("User must be logged in to create tasks");
      return createTask({ ...task, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<TaskInput> }) => 
      updateTask(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}

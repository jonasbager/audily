
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOnboardingData, saveOnboardingData } from "@/services/onboardingService";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";

interface OnboardingInput {
  company_name: string;
  team_size: string;
  compliance_framework: string;
  systems: string[];
  target_date: string;
  contact_role: string;
  additional_info?: string;
  profile_complete?: boolean;
  user_id: string;
}

export function useOnboardingProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: () => user ? fetchOnboardingData(user.id) : null,
    enabled: !!user,
  });
}

export function useUpdateOnboardingProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (data: Omit<OnboardingInput, "user_id">) => {
      if (!user) throw new Error("User must be logged in to update profile");
      return saveOnboardingData({ ...data, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });
}

export function useComplianceStatus() {
  const { data: tasks, isLoading: isTasksLoading } = useTasks();
  
  // Calculate compliance status based on task completion
  return useQuery({
    queryKey: ['compliance-status'],
    queryFn: () => {
      // If no tasks, return a low score
      if (!tasks || tasks.length === 0) return 0;
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'done').length;
      const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
      
      // Calculate percentage - completed tasks are worth full points, in-progress are worth half points
      const percentage = Math.round(((completedTasks + (inProgressTasks * 0.5)) / totalTasks) * 100);
      
      // Ensure percentage is between 0 and 100
      return Math.min(100, Math.max(0, percentage));
    },
    enabled: !isTasksLoading,
  });
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchOnboardingData, 
  saveOnboardingData, 
  fetchComplianceStatus, 
  updateComplianceStatus,
  OnboardingInput
} from "@/services/onboardingService";
import { useAuth } from "@/hooks/useAuth";

export function useOnboardingData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: () => user ? fetchOnboardingData(user.id) : null,
    enabled: !!user
  });
}

export function useSaveOnboardingData() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (data: Omit<OnboardingInput, "user_id">) => {
      if (!user) throw new Error("User must be logged in to save onboarding data");
      return saveOnboardingData({ ...data, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] });
    }
  });
}

export function useComplianceStatus() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['compliance-status', user?.id],
    queryFn: () => user ? fetchComplianceStatus(user.id) : 0,
    enabled: !!user
  });
}

export function useUpdateComplianceStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (progress: number) => {
      if (!user) throw new Error("User must be logged in to update compliance status");
      return updateComplianceStatus(user.id, progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] });
    }
  });
}

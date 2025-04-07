
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchOnboardingData, 
  saveOnboardingData, 
  fetchComplianceStatus, 
  updateComplianceStatus,
  OnboardingInput
} from "@/services/onboardingService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function useOnboardingData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error("User must be logged in to fetch onboarding data");
      }
      const data = await fetchOnboardingData(user.id);
      return data;
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaveOnboardingData() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<OnboardingInput, "user_id">) => {
      if (!user) {
        throw new Error("User must be logged in to save onboarding data");
      }
      return await saveOnboardingData({ ...data, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] });
    },
    onError: (error: any) => {
      console.error("Error saving onboarding data:", error);
      toast({
        title: "Failed to save profile",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });
}

export function useComplianceStatus() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['compliance-status', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      return await fetchComplianceStatus(user.id);
    },
    enabled: !!user,
    retry: 1
  });
}

export function useUpdateComplianceStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (progress: number) => {
      if (!user) {
        throw new Error("User must be logged in to update compliance status");
      }
      return await updateComplianceStatus(user.id, progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] });
    },
    onError: (error: any) => {
      console.error("Error updating compliance status:", error);
      toast({
        title: "Failed to update compliance status",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });
}

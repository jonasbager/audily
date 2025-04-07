
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchIntegrations, 
  fetchIntegrationById, 
  createIntegration, 
  updateIntegration, 
  deleteIntegration,
  IntegrationInput
} from "@/services/integrationService";
import { useAuth } from "@/hooks/useAuth";

export function useIntegrations() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['integrations', user?.id],
    queryFn: fetchIntegrations,
    enabled: !!user
  });
}

export function useIntegration(id: string | undefined) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['integration', id],
    queryFn: () => id ? fetchIntegrationById(id) : null,
    enabled: !!(id && user)
  });
}

export function useCreateIntegration() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (integration: Omit<IntegrationInput, "user_id">) => {
      if (!user) throw new Error("User must be logged in to create integrations");
      return createIntegration({ ...integration, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    }
  });
}

export function useUpdateIntegration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<IntegrationInput> }) => 
      updateIntegration(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['integration', variables.id] });
    }
  });
}

export function useDeleteIntegration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    }
  });
}

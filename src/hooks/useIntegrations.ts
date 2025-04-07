
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchIntegrations, 
  fetchIntegrationById, 
  createIntegration, 
  updateIntegration, 
  deleteIntegration,
  IntegrationInput
} from "@/services/integrationService";

export function useIntegrations() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: fetchIntegrations
  });
}

export function useIntegration(id: string | undefined) {
  return useQuery({
    queryKey: ['integration', id],
    queryFn: () => id ? fetchIntegrationById(id) : null,
    enabled: !!id
  });
}

export function useCreateIntegration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (integration: IntegrationInput) => createIntegration(integration),
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

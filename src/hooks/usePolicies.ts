
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchPolicies, 
  fetchPolicyById, 
  createPolicy, 
  updatePolicy, 
  deletePolicy,
  PolicyInput
} from "@/services/policyService";
import { useAuth } from "@/hooks/useAuth";

export function usePolicies() {
  return useQuery({
    queryKey: ['policies'],
    queryFn: fetchPolicies
  });
}

export function usePolicy(id: string | undefined) {
  return useQuery({
    queryKey: ['policy', id],
    queryFn: () => id ? fetchPolicyById(id) : null,
    enabled: !!id
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (policy: Omit<PolicyInput, "user_id">) => {
      if (!user) throw new Error("User must be logged in to create policies");
      return createPolicy({ ...policy, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    }
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<PolicyInput> }) => 
      updatePolicy(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      queryClient.invalidateQueries({ queryKey: ['policy', variables.id] });
    }
  });
}

export function useDeletePolicy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    }
  });
}

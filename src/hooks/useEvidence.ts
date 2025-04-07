
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchEvidence, 
  fetchEvidenceById, 
  createEvidence, 
  updateEvidence, 
  deleteEvidence,
  uploadEvidenceFile,
  EvidenceInput
} from "@/services/evidenceService";
import { useAuth } from "@/hooks/useAuth";

export function useEvidence() {
  return useQuery({
    queryKey: ['evidence'],
    queryFn: fetchEvidence
  });
}

export function useEvidenceItem(id: string | undefined) {
  return useQuery({
    queryKey: ['evidence', id],
    queryFn: () => id ? fetchEvidenceById(id) : null,
    enabled: !!id
  });
}

export function useCreateEvidence() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (evidence: Omit<EvidenceInput, "user_id">) => {
      if (!user) throw new Error("User must be logged in to create evidence");
      return createEvidence({ ...evidence, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    }
  });
}

export function useUpdateEvidence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<EvidenceInput> }) => 
      updateEvidence(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      queryClient.invalidateQueries({ queryKey: ['evidence', variables.id] });
    }
  });
}

export function useDeleteEvidence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteEvidence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    }
  });
}

export function useUploadEvidenceFile() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("User must be logged in to upload files");
      return uploadEvidenceFile(file, user.id);
    }
  });
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchTeamMembers, 
  inviteTeamMember, 
  updateTeamMember, 
  removeTeamMember,
  TeamMemberInput
} from "@/services/teamMemberService";
import { useAuth } from "@/hooks/useAuth";

export function useTeamMembers() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['team-members', user?.id],
    queryFn: fetchTeamMembers,
    enabled: !!user
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (teamMember: TeamMemberInput) => inviteTeamMember(teamMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    }
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<TeamMemberInput> }) => 
      updateTeamMember(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    }
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => removeTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    }
  });
}

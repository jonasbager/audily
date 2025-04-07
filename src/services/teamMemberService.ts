
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface TeamMember {
  id: string;
  user_id: string | null;
  email: string;
  name: string | null;
  role: string;
  status: string;
  invited_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberInput {
  email: string;
  role: string;
  name?: string | null;
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    // Use "from" method with a string parameter to work around the type issue
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Cast the result to TeamMember[] to ensure type safety
    return (data || []) as TeamMember[];
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    toast({
      title: "Error fetching team members",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function inviteTeamMember(input: TeamMemberInput): Promise<TeamMember | null> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("You must be logged in to invite team members");

    // Use "from" method with a string parameter to work around the type issue
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        email: input.email,
        role: input.role,
        name: input.name || null,
        status: 'invited',
        invited_by: user.user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${input.email}`
    });
    
    return data as TeamMember;
  } catch (error: any) {
    console.error('Error inviting team member:', error);
    toast({
      title: "Error inviting team member",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updateTeamMember(id: string, updates: Partial<TeamMemberInput>): Promise<TeamMember | null> {
  try {
    // Use "from" method with a string parameter to work around the type issue
    const { data, error } = await supabase
      .from('team_members')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Team member updated",
      description: "Team member information has been updated successfully"
    });
    
    return data as TeamMember;
  } catch (error: any) {
    console.error('Error updating team member:', error);
    toast({
      title: "Error updating team member",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function removeTeamMember(id: string): Promise<boolean> {
  try {
    // Use "from" method with a string parameter to work around the type issue
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Team member removed",
      description: "Team member has been removed successfully"
    });
    
    return true;
  } catch (error: any) {
    console.error('Error removing team member:', error);
    toast({
      title: "Error removing team member",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}

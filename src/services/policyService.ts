
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Policy {
  id: string;
  title: string;
  description: string | null;
  framework: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyInput {
  title: string;
  description?: string;
  framework: string;
  status?: string;
}

export async function fetchPolicies(): Promise<Policy[]> {
  try {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching policies:', error);
    toast({
      title: "Error fetching policies",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function fetchPolicyById(id: string): Promise<Policy | null> {
  try {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching policy:', error);
    toast({
      title: "Error fetching policy",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function createPolicy(policy: PolicyInput): Promise<Policy | null> {
  try {
    const { data, error } = await supabase
      .from('policies')
      .insert([policy])
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Policy created",
      description: "Your policy has been created successfully"
    });
    
    return data;
  } catch (error: any) {
    console.error('Error creating policy:', error);
    toast({
      title: "Error creating policy",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updatePolicy(id: string, updates: Partial<PolicyInput>): Promise<Policy | null> {
  try {
    const { data, error } = await supabase
      .from('policies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Policy updated",
      description: "Your policy has been updated successfully"
    });
    
    return data;
  } catch (error: any) {
    console.error('Error updating policy:', error);
    toast({
      title: "Error updating policy",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function deletePolicy(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Policy deleted",
      description: "Your policy has been deleted successfully"
    });
    
    return true;
  } catch (error: any) {
    console.error('Error deleting policy:', error);
    toast({
      title: "Error deleting policy",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}

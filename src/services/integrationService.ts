
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Integration {
  id: string;
  user_id: string;
  service_name: string;
  service_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationInput {
  service_name: string;
  service_id?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  token_expires_at?: string | null;
  status?: string;
}

export async function fetchIntegrations(): Promise<Integration[]> {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching integrations:', error);
    toast({
      title: "Error fetching integrations",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function fetchIntegrationById(id: string): Promise<Integration | null> {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching integration:', error);
    toast({
      title: "Error fetching integration",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function createIntegration(integration: IntegrationInput): Promise<Integration | null> {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .insert([integration])
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Integration created",
      description: "Your integration has been created successfully"
    });
    
    return data;
  } catch (error: any) {
    console.error('Error creating integration:', error);
    toast({
      title: "Error creating integration",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updateIntegration(id: string, updates: Partial<IntegrationInput>): Promise<Integration | null> {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Integration updated",
      description: "Your integration has been updated successfully"
    });
    
    return data;
  } catch (error: any) {
    console.error('Error updating integration:', error);
    toast({
      title: "Error updating integration",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function deleteIntegration(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Integration deleted",
      description: "Your integration has been deleted successfully"
    });
    
    return true;
  } catch (error: any) {
    console.error('Error deleting integration:', error);
    toast({
      title: "Error deleting integration",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}

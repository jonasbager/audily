
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Evidence {
  id: string;
  task_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EvidenceInput {
  task_id?: string | null;
  title: string;
  description?: string | null;
  file_path?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  status?: string;
}

export async function fetchEvidence(): Promise<Evidence[]> {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching evidence:', error);
    toast({
      title: "Error fetching evidence",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function fetchEvidenceById(id: string): Promise<Evidence | null> {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching evidence:', error);
    toast({
      title: "Error fetching evidence",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function createEvidence(evidence: EvidenceInput): Promise<Evidence | null> {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .insert([evidence])
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Evidence created",
      description: "Your evidence has been uploaded successfully"
    });
    
    return data;
  } catch (error: any) {
    console.error('Error creating evidence:', error);
    toast({
      title: "Error uploading evidence",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updateEvidence(id: string, updates: Partial<EvidenceInput>): Promise<Evidence | null> {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Evidence updated",
      description: "Your evidence has been updated successfully"
    });
    
    return data;
  } catch (error: any) {
    console.error('Error updating evidence:', error);
    toast({
      title: "Error updating evidence",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function deleteEvidence(id: string): Promise<boolean> {
  try {
    // First get the evidence to find the file path
    const { data: evidence, error: fetchError } = await supabase
      .from('evidence')
      .select('file_path')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // If there's a file associated with this evidence, delete it from storage
    if (evidence?.file_path) {
      const { error: storageError } = await supabase.storage
        .from('evidence')
        .remove([evidence.file_path]);
      
      if (storageError) throw storageError;
    }
    
    // Now delete the evidence record
    const { error } = await supabase
      .from('evidence')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Evidence deleted",
      description: "Your evidence has been deleted successfully"
    });
    
    return true;
  } catch (error: any) {
    console.error('Error deleting evidence:', error);
    toast({
      title: "Error deleting evidence",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}

export async function uploadEvidenceFile(file: File, userId: string): Promise<string | null> {
  try {
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    
    const { error } = await supabase.storage
      .from('evidence')
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Get the public URL for the file
    const { data } = supabase.storage
      .from('evidence')
      .getPublicUrl(filePath);
    
    return filePath;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    toast({
      title: "Error uploading file",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

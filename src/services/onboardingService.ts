
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface OnboardingData {
  id: string;
  user_id: string;
  company_name: string;
  team_size: string;
  compliance_framework: string;
  systems: string[];
  target_date: string;
  contact_role: string;
  additional_info: string | null;
  created_at: string;
  updated_at: string;
  profile_complete: boolean;
}

export interface OnboardingInput {
  company_name: string;
  team_size: string;
  compliance_framework: string;
  systems: string[];
  target_date: string;
  contact_role: string;
  additional_info?: string | null;
  profile_complete?: boolean;
  user_id: string;
}

export async function fetchOnboardingData(userId: string): Promise<OnboardingData | null> {
  try {
    const { data, error } = await supabase
      .from('onboarding')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching onboarding data:', error);
    toast({
      title: "Error fetching onboarding data",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function saveOnboardingData(data: OnboardingInput): Promise<OnboardingData | null> {
  try {
    // Check if data exists for this user
    const { data: existingData, error: checkError } = await supabase
      .from('onboarding')
      .select('id')
      .eq('user_id', data.user_id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingData) {
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from('onboarding')
        .update(data)
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your compliance profile has been updated"
      });
      
      return updatedData;
    } else {
      // Insert new record
      const { data: newData, error } = await supabase
        .from('onboarding')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Profile created",
        description: "Your compliance profile has been created"
      });
      
      return newData;
    }
  } catch (error: any) {
    console.error('Error saving onboarding data:', error);
    toast({
      title: "Error saving profile",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updateComplianceStatus(userId: string, progress: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('compliance_status')
      .upsert({
        user_id: userId,
        progress_percentage: progress,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error updating compliance status:', error);
    return false;
  }
}

export async function fetchComplianceStatus(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('compliance_status')
      .select('progress_percentage')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data?.progress_percentage || 0;
  } catch (error) {
    console.error('Error fetching compliance status:', error);
    return 0;
  }
}

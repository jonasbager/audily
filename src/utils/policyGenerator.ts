
import { supabase } from "@/integrations/supabase/client";

// Real AI-generated text function using our edge function
export const generatePolicyText = async (sectionName: string, policyName: string, framework: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('openai', {
      body: {
        type: 'policy',
        prompt: sectionName,
        policyName: policyName,
        framework: framework
      }
    });
    
    if (error) throw new Error(error.message);
    
    return data.text || `Failed to generate ${sectionName} for ${policyName} policy.`;
  } catch (error: any) {
    console.error('Error generating policy text:', error);
    // Fallback to mock data if the API call fails
    const frameworkSpecificText = framework === 'nis2'
      ? `This is a placeholder ${sectionName} for the ${policyName} aligned with NIS2 Directive requirements. The OpenAI integration encountered an error: ${error.message}`
      : `This is a placeholder ${sectionName} for the ${policyName} aligned with ${framework.toUpperCase()} requirements. The OpenAI integration encountered an error: ${error.message}`;
    
    return frameworkSpecificText;
  }
};

// Generic section titles that work for both frameworks
export const sectionTitles: Record<string, string> = {
  purpose: 'Purpose and Objectives',
  scope: 'Scope and Applicability',
  policy: 'Policy Statement',
  responsibilities: 'Roles and Responsibilities',
  compliance: 'Compliance and Enforcement',
};

// Default empty sections for new policies
export const defaultSections = {
  purpose: '',
  scope: '',
  policy: '',
  responsibilities: '',
  compliance: '',
};

export interface PolicySections {
  [key: string]: string;
}

// Generate AI-assisted "Next Steps" summary based on current progress
export const generateNextSteps = async (completionPercentage: number, framework: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('openai', {
      body: {
        type: 'next_steps',
        completionPercentage,
        framework
      }
    });
    
    if (error) throw new Error(error.message);
    
    return data.text || `Unable to generate next steps recommendation.`;
  } catch (error: any) {
    console.error('Error generating next steps:', error);
    return `Based on your ${completionPercentage}% completion, we recommend focusing on the remaining items in your checklist to improve your audit readiness.`;
  }
};

// Helper function to generate a risk assessment based on user inputs
export const generateRiskAssessment = async (
  companyData: {
    industry: string;
    size: string;
    systems: string[];
    vendors: string[];
  }, 
  framework: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('openai', {
      body: {
        type: 'risk_assessment',
        companyData,
        framework
      }
    });
    
    if (error) throw new Error(error.message);
    
    return data.riskProfile || [];
  } catch (error: any) {
    console.error('Error generating risk assessment:', error);
    return [];
  }
};

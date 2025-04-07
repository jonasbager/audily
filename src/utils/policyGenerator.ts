
// Mock AI-generated text function - would be replaced with a real API call
export const generatePolicyText = (sectionName: string, policyName: string, framework: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // This is where we would call our AI API
      const frameworkSpecificText = framework === 'nis2'
        ? `This is an AI-generated ${sectionName} for the ${policyName} aligned with NIS2 Directive requirements. It covers cybersecurity measures, incident reporting, and risk assessment for essential services.`
        : `This is an AI-generated ${sectionName} for the ${policyName} aligned with ${framework.toUpperCase()} requirements. It focuses on financial reporting controls, documentation standards, and testing procedures.`;
      
      resolve(frameworkSpecificText);
    }, 1500);
  });
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

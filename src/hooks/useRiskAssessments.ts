import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type RiskAssessment = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high';
  status: 'open' | 'mitigated' | 'accepted';
  framework: string | null;
  created_at: string;
  updated_at: string;
};

export const useRiskAssessments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['risk_assessments', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<RiskAssessment[]> => {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as RiskAssessment[];
    },
  });
};

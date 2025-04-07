
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signUp = async (email: string, password: string, metadata: { name: string; company: string }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return {
    ...context,
    signIn,
    signUp,
    signOut,
  };
};

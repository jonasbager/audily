
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return response;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata: { name: string; company: string }) => {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      return response;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const response = await supabase.auth.signOut();
      return response;
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
  };

  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  };

  return {
    ...context,
    signIn,
    signUp,
    signOut,
    refreshSession,
    getSession
  };
};

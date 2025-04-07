
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Error signing in:', error.message);
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }
      
      console.log('User signed in', data.user?.id);
      return { data, error: null };
    } catch (err: any) {
      console.error('Unexpected error during sign in:', err.message);
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, metadata: { name: string; company: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error('Error signing up:', error.message);
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }
      
      console.log('User signed up', data.user?.id);
      toast({
        title: 'Account created',
        description: 'Please check your email to confirm your account.',
      });
      return { data, error: null };
    } catch (err: any) {
      console.error('Unexpected error during sign up:', err.message);
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }
      
      console.log('User signed out');
      return { error: null };
    } catch (err: any) {
      console.error('Unexpected error during sign out:', err.message);
      toast({
        title: 'Sign out failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return { error: err };
    }
  };

  return {
    ...context,
    signIn,
    signUp,
    signOut,
  };
};

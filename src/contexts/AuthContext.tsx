
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserOnboarding = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('onboarding')
        .select('profile_complete')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking onboarding status:', error);
        return;
      }
      
      // If onboarding record doesn't exist or profile is not complete, redirect to onboarding
      if (!data || !data.profile_complete) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during onboarding check:', error);
    }
  }, [navigate]);

  useEffect(() => {
    const handleAuthStateChange = (event: string, currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      // Handle auth events
      if (event === 'SIGNED_IN') {
        console.log('User signed in', currentSession?.user?.id);
        if (currentSession?.user) {
          // Don't navigate here, we'll check onboarding status first
          checkUserOnboarding(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        navigate('/auth');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated', currentSession?.user?.id);
        setUser(currentSession?.user ?? null);
      }
    };

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log('User already signed in:', currentSession.user.id);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error('Error retrieving session:', error);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, checkUserOnboarding]);

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

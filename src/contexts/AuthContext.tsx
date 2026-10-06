import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, nome: string, whatsapp?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test-only escape hatch: when Supabase's own "Confirm email" is off (to
// avoid burning the project's email rate limit during testing), this makes
// signUp() fake the same "pending confirmation" state locally instead of
// silently leaving the user logged in. Must be off in production.
const TEST_SKIP_EMAIL_CONFIRM = import.meta.env.VITE_TEST_SKIP_EMAIL_CONFIRM === 'true';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, nome: string, whatsapp?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/cadastrar-igreja`,
          data: {
            nome_completo: nome,
            whatsapp: whatsapp || null,
          },
        },
      });

      if (error) throw error;

      if (TEST_SKIP_EMAIL_CONFIRM && data.user) {
        // Supabase's "Confirm email" is off in test mode, so signUp() just
        // returned an active session. Create the profile flagged as
        // unconfirmed and drop that session right away, so the app still
        // goes through the same "pending confirmation" step as production
        // (simulated later at login) instead of leaving the user logged in.
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            nome_completo: nome,
            email,
            whatsapp: whatsapp || null,
            confirmado: false,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        await supabase.auth.signOut();
        return { error: null };
      }

      // No active session exists yet - the account is only confirmed (and
      // usable) once the user clicks the link in the confirmation email.
      // The profile row is created later, in CadastrarIgreja.tsx, once a
      // real session exists.
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

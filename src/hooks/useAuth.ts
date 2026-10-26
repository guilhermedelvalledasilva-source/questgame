import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apply = async (session: { user: { id: string; email?: string; user_metadata?: Record<string, unknown> } } | null) => {
      if (!session) { setCurrentUser(null); setLoading(false); return; }
      const u = session.user;
      const metaName = (u.user_metadata?.name as string) || '';
      setCurrentUser({ id: u.id, email: u.email ?? '', name: metaName || (u.email ?? '').split('@')[0] });
      setLoading(false);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { apply(session); });
    supabase.auth.getSession().then(({ data }) => apply(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<AuthUser | null> => {
    if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { emailRedirectTo: window.location.origin, data: { name: name.trim() } },
    });
    if (error) throw new Error(error.message.includes('registered') ? 'Este email já está cadastrado.' : error.message);
    if (!data.session || !data.user) return null;
    return { id: data.user.id, email: data.user.email ?? '', name: name.trim() || email.split('@')[0] };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw new Error(error.message.includes('confirmed') ? 'Confirme seu email antes de entrar.' : 'Email ou senha incorretos.');
    const u = data.user;
    return { id: u.id, email: u.email ?? '', name: (u.user_metadata?.name as string) || (u.email ?? '').split('@')[0] };
  }, []);

  const logout = useCallback(async () => { await supabase.auth.signOut(); }, []);

  return { currentUser, loading, register, login, logout };
}

'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const supabase = createClient();
  const router = useRouter();

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  return { signInWithGoogle, signOut, getUser };
}

import { createClient } from '@/lib/supabase/client';

export const authService = {
  async signIn(email: string, password: string) {
    const supabase = createClient();
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string) {
    const supabase = createClient();
    return supabase.auth.signUp({ email, password });
  },

  async signOut() {
    const supabase = createClient();
    return supabase.auth.signOut();
  },

  async getSession() {
    const supabase = createClient();
    return supabase.auth.getSession();
  },

  async getUser() {
    const supabase = createClient();
    return supabase.auth.getUser();
  },

  async resetPasswordForEmail(email: string, redirectTo: string) {
    const supabase = createClient();
    return supabase.auth.resetPasswordForEmail(email, { redirectTo });
  },

  async updatePassword(password: string) {
    const supabase = createClient();
    return supabase.auth.updateUser({ password });
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    const supabase = createClient();
    return supabase.auth.onAuthStateChange(callback);
  },
};

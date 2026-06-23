import { createClient } from '@/lib/supabase/client';
import type { ShareInvite } from '@/types';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;
const INVITE_DAYS = 7;

function isMissingRelationError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    (error.message?.includes('baby_share_invites') ?? false) ||
    (error.message?.includes('accept_baby_share_code') ?? false) ||
    (error.message?.includes('schema cache') ?? false)
  );
}

function randomShareCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export const sharingService = {
  async createInvite(babyId: string, userId: string): Promise<ShareInvite> {
    const supabase = createClient();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITE_DAYS);

    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = randomShareCode();
      const { error } = await supabase.from('baby_share_invites').insert({
        baby_id: babyId,
        code,
        created_by: userId,
        expires_at: expiresAt.toISOString(),
      });
      if (!error) return { code, expiresAt: expiresAt.toISOString(), babyId };
      lastError = error as Error;
      if ((error as { code?: string }).code !== '23505') break;
    }
    throw lastError ?? new Error('Could not create code. Ensure migration 008 is applied.');
  },

  async acceptCode(code: string): Promise<string> {
    const supabase = createClient();
    const normalized = code.trim().toUpperCase();
    const { data, error } = await supabase.rpc('accept_baby_share_code', { p_code: normalized });
    if (error) {
      if (isMissingRelationError(error)) {
        throw new Error('Sharing is not enabled. Run migration 008 in Supabase SQL Editor.');
      }
      throw error;
    }
    return data as string;
  },

  getDeepLink(code: string, origin: string): string {
    return `${origin.replace(/\/$/, '')}/join/${code.trim().toUpperCase()}`;
  },
};

import { MAX_OWNED_BABIES } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import type { Baby, BabyGender } from '@/types';
import type { Database } from '@/types/database';

type DbBaby = Database['public']['Tables']['babies']['Row'];

function isMissingRelationError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    (error.message?.includes('baby_caregivers') ?? false) ||
    (error.message?.includes('count_owned_babies') ?? false) ||
    (error.message?.includes('schema cache') ?? false)
  );
}

function dbBabyToBaby(row: DbBaby, userId?: string): Baby {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    birthTime: row.birth_time ?? undefined,
    gender: (row.gender as BabyGender) ?? undefined,
    avatarUri: row.avatar_uri ?? undefined,
    isOwner: userId != null ? row.user_id === userId : undefined,
  };
}

export const childService = {
  async list(userId: string): Promise<Baby[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('babies')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      const fallback = await supabase
        .from('babies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (fallback.error) throw fallback.error;
      return (fallback.data as DbBaby[]).map((row) => dbBabyToBaby(row, userId));
    }
    return (data as DbBaby[]).map((row) => dbBabyToBaby(row, userId));
  },

  async countOwned(userId: string): Promise<number> {
    const supabase = createClient();
    const rpc = await supabase.rpc('count_owned_babies');
    if (!rpc.error && typeof rpc.data === 'number') return rpc.data;

    const { count, error } = await supabase
      .from('babies')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (error) {
      if (isMissingRelationError(error)) return 0;
      throw error;
    }
    return count ?? 0;
  },

  async ensureOwnerCaregiverRow(babyId: string, userId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('baby_caregivers').insert({
      baby_id: babyId,
      user_id: userId,
      role: 'owner',
    });
    if (!error) return;
    if (isMissingRelationError(error)) return;
    if (error.code === '23505') return;
    throw error;
  },

  async create(userId: string, input: Omit<Baby, 'id'>): Promise<Baby> {
    const owned = await childService.countOwned(userId);
    if (owned >= MAX_OWNED_BABIES) {
      throw new Error(`You can have at most ${MAX_OWNED_BABIES} babies per account.`);
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from('babies')
      .insert({
        user_id: userId,
        name: input.name,
        birth_date: input.birthDate,
        birth_time: input.birthTime ?? null,
        gender: input.gender ?? null,
        avatar_uri: input.avatarUri ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message ?? 'Unknown error');
    const created = data as DbBaby;
    await childService.ensureOwnerCaregiverRow(created.id, userId);
    return dbBabyToBaby(created, userId);
  },

  async update(id: string, updates: Partial<Omit<Baby, 'id'>>): Promise<void> {
    const supabase = createClient();
    const row: Partial<DbBaby> = {};
    if (updates.name != null) row.name = updates.name;
    if (updates.birthDate != null) row.birth_date = updates.birthDate;
    if (updates.birthTime != null) row.birth_time = updates.birthTime;
    if (updates.gender != null) row.gender = updates.gender;
    if (updates.avatarUri != null) row.avatar_uri = updates.avatarUri;
    const { error } = await supabase.from('babies').update(row).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('babies').delete().eq('id', id);
    if (error) throw error;
  },
};

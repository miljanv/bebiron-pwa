import { createClient } from '@/lib/supabase/client';
import type { Activity, DiaperType, NewActivity } from '@/types';
import type { Database } from '@/types/database';

type DbActivity = Database['public']['Tables']['activities']['Row'];

function dbActivityToActivity(row: DbActivity): Activity {
  if (row.type === 'feed') {
    return {
      id: row.id,
      babyId: row.baby_id,
      type: 'feed',
      date: row.date,
      time: row.time ?? '',
      quantityMl: row.quantity_ml ?? 0,
      feedType: row.feed_type ?? '',
    };
  }
  if (row.type === 'sleep') {
    return {
      id: row.id,
      babyId: row.baby_id,
      type: 'sleep',
      date: row.date,
      startTime: row.start_time ?? '',
      endTime: row.end_time ?? '',
    };
  }
  return {
    id: row.id,
    babyId: row.baby_id,
    type: 'diaper',
    date: row.date,
    time: row.time ?? '',
    diaperType: (row.diaper_type as DiaperType) ?? 'wet',
  };
}

function activityToDb(
  activity: NewActivity,
): Database['public']['Tables']['activities']['Insert'] {
  const base = {
    baby_id: activity.babyId,
    type: activity.type,
    date: activity.date,
  };
  if (activity.type === 'feed') {
    return {
      ...base,
      time: activity.time,
      start_time: null,
      end_time: null,
      quantity_ml: activity.quantityMl,
      feed_type: activity.feedType,
      diaper_type: null,
    };
  }
  if (activity.type === 'sleep') {
    return {
      ...base,
      time: null,
      start_time: activity.startTime,
      end_time: activity.endTime,
      quantity_ml: null,
      feed_type: null,
      diaper_type: null,
    };
  }
  return {
    ...base,
    time: activity.time,
    start_time: null,
    end_time: null,
    quantity_ml: null,
    feed_type: null,
    diaper_type: activity.diaperType,
  };
}

export const activityService = {
  async listForBaby(babyId: string, date?: string, limit = 100): Promise<Activity[]> {
    const supabase = createClient();
    let q = supabase
      .from('activities')
      .select('*')
      .eq('baby_id', babyId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (date) q = q.eq('date', date);
    const { data, error } = await q;
    if (error) throw error;
    return (data as DbActivity[]).map(dbActivityToActivity);
  },

  async listForBabies(babyIds: string[]): Promise<Activity[]> {
    if (babyIds.length === 0) return [];
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .in('baby_id', babyIds)
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data as DbActivity[]).map(dbActivityToActivity);
  },

  async create(activity: NewActivity): Promise<Activity> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activities')
      .insert(activityToDb(activity))
      .select()
      .single();
    if (error) throw error;
    return dbActivityToActivity(data as DbActivity);
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw error;
  },
};

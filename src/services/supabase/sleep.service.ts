import type { SleepActivity } from '@/types';

import { activityService } from './activity.service';

export const sleepService = {
  async create(input: Omit<SleepActivity, 'id'>) {
    return activityService.create(input);
  },
  async listForBaby(babyId: string, date?: string) {
    const all = await activityService.listForBaby(babyId, date);
    return all.filter((a): a is SleepActivity => a.type === 'sleep');
  },
};

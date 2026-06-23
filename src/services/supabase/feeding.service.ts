import type { FeedActivity } from '@/types';

import { activityService } from './activity.service';

export const feedingService = {
  async create(input: Omit<FeedActivity, 'id'>) {
    return activityService.create(input);
  },
  async listForBaby(babyId: string, date?: string) {
    const all = await activityService.listForBaby(babyId, date);
    return all.filter((a): a is FeedActivity => a.type === 'feed');
  },
};

import type { DiaperActivity } from '@/types';

import { activityService } from './activity.service';

/**
 * Growth-related events. Current schema does not yet track separate growth metrics
 * (height/weight) — placeholder for future migration. Today this includes diaper logs
 * as a baseline daily growth/care indicator alongside feeding and sleep services.
 */
export const growthService = {
  async createDiaper(input: Omit<DiaperActivity, 'id'>) {
    return activityService.create(input);
  },
  async listDiapers(babyId: string, date?: string) {
    const all = await activityService.listForBaby(babyId, date);
    return all.filter((a): a is DiaperActivity => a.type === 'diaper');
  },
};

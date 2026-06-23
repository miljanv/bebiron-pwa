import { z } from 'zod';

const dateRe = /^\d{4}-\d{2}-\d{2}$/;
const timeRe = /^\d{2}:\d{2}$/;

export const feedActivitySchema = z.object({
  date: z.string().regex(dateRe),
  time: z.string().regex(timeRe),
  quantityMl: z
    .preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive({
      message: 'home.enterQuantityMl',
    })),
  feedType: z.string().min(1, { message: 'home.enterQuantityMl' }),
});

export type FeedActivityInput = z.infer<typeof feedActivitySchema>;

export const sleepActivitySchema = z.object({
  date: z.string().regex(dateRe),
  startTime: z.string().regex(timeRe),
  endTime: z.string().regex(timeRe),
});

export type SleepActivityInput = z.infer<typeof sleepActivitySchema>;

export const diaperActivitySchema = z.object({
  date: z.string().regex(dateRe),
  time: z.string().regex(timeRe),
  diaperType: z.enum(['wet', 'dirty', 'both']),
});

export type DiaperActivityInput = z.infer<typeof diaperActivitySchema>;

export const joinBabySchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, { message: 'settings.enterValidCode' })
    .max(12, { message: 'settings.enterValidCode' })
    .transform((v) => v.toUpperCase()),
});

export type JoinBabyInput = z.infer<typeof joinBabySchema>;

export const reminderMinutesSchema = z.object({
  minutes: z
    .preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().min(1).max(1440)),
});

export type ReminderMinutesInput = z.infer<typeof reminderMinutesSchema>;

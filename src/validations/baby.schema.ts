import { z } from 'zod';

const dateRe = /^\d{4}-\d{2}-\d{2}$/;
const timeRe = /^\d{2}:\d{2}$/;

export const onboardingChildSchema = z.object({
  name: z.string().trim().min(1, { message: 'home.enterChildName' }),
  gender: z.enum(['male', 'female']).optional(),
  birthDate: z.string().regex(dateRe, { message: 'home.enterChildName' }),
  birthTime: z.string().regex(timeRe).optional(),
});

export type OnboardingChildInput = z.infer<typeof onboardingChildSchema>;

export const babyFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'home.enterChildName' }),
  birthDate: z.string().regex(dateRe, { message: 'home.enterChildName' }),
});

export type BabyFormInput = z.infer<typeof babyFormSchema>;

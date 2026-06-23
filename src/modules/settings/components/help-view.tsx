'use client';

import {
  Baby as BabyIcon,
  Bell,
  Images,
  Lightbulb,
  Link2,
  Milk,
  Moon,
  QrCode,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PageHeader } from '@/components/shared/page-header';
import { BRAND_COLORS, MAX_OWNED_BABIES } from '@/constants';

type StepId = 'addBaby' | 'activities' | 'switchBaby' | 'shareBaby' | 'joinBaby' | 'reminders' | 'gallery';

type StepConfig = {
  id: StepId;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
};

const STEPS: StepConfig[] = [
  { id: 'addBaby', icon: BabyIcon, iconColor: BRAND_COLORS.sage, iconBg: 'rgba(139, 155, 142, 0.18)' },
  { id: 'activities', icon: Milk, iconColor: BRAND_COLORS.softBlue, iconBg: 'rgba(164, 196, 212, 0.25)' },
  { id: 'switchBaby', icon: BabyIcon, iconColor: BRAND_COLORS.text, iconBg: 'rgba(196, 181, 160, 0.35)' },
  { id: 'shareBaby', icon: Link2, iconColor: BRAND_COLORS.sage, iconBg: 'rgba(139, 155, 142, 0.18)' },
  { id: 'joinBaby', icon: QrCode, iconColor: BRAND_COLORS.softBlue, iconBg: 'rgba(164, 196, 212, 0.25)' },
  { id: 'reminders', icon: Bell, iconColor: BRAND_COLORS.softBlue, iconBg: 'rgba(164, 196, 212, 0.25)' },
  { id: 'gallery', icon: Images, iconColor: BRAND_COLORS.sage, iconBg: 'rgba(139, 155, 142, 0.18)' },
];

export function HelpView() {
  const t = useTranslations();
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-safe lg:pt-8">
      <PageHeader title={t('help.title')} backHref="/settings" />

      <div className="mt-6 flex flex-col items-center rounded-brand-lg bg-card p-6 text-center shadow-brand">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(139, 155, 142, 0.18)' }}
        >
          <Lightbulb className="h-6 w-6 accent-text" />
        </span>
        <h2 className="mt-3 text-xl font-bold text-brand-text">{t('help.heroTitle')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-text-muted">{t('help.intro')}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Pill icon={Milk} iconColor={BRAND_COLORS.sage} bg="rgba(139, 155, 142, 0.12)">
            {t('home.food')}
          </Pill>
          <Pill icon={Moon} iconColor={BRAND_COLORS.softBlue} bg="rgba(164, 196, 212, 0.2)">
            {t('home.activitySleep')}
          </Pill>
          <Pill icon={Users} iconColor={BRAND_COLORS.textMuted} bg="rgba(196, 181, 160, 0.25)">
            {t('settings.sectionFamily')}
          </Pill>
        </div>
      </div>

      <p className="ml-1 mt-6 text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
        {t('help.stepsSection')}
      </p>

      <ol className="mt-3 flex flex-col gap-3">
        {STEPS.map((step, i) => (
          <li key={step.id}>
            <StepCard
              step={i + 1}
              icon={step.icon}
              iconColor={step.iconColor}
              iconBg={step.iconBg}
              title={t(`help.steps.${step.id}.title`)}
              body={t(`help.steps.${step.id}.body`)}
            />
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-brand-lg bg-card p-5 shadow-brand">
        <div className="mb-3 flex items-center gap-2">
          <Images className="h-5 w-5" style={{ color: BRAND_COLORS.sage }} />
          <p className="flex-1 text-base font-bold text-brand-text">{t('help.tipsTitle')}</p>
        </div>
        <ul className="space-y-1.5 text-sm leading-relaxed text-brand-text-muted">
          <li>• {t('help.tipGallery')}</li>
          <li>• {t('help.tipMaxBabies', { max: MAX_OWNED_BABIES })}</li>
          <li>• {t('help.tipCodeExpiry')}</li>
        </ul>
      </div>
    </div>
  );
}

function Pill({
  icon: Icon,
  iconColor,
  bg,
  children,
}: {
  icon: LucideIcon;
  iconColor: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-brand-md px-2.5 py-1.5 text-xs font-semibold text-brand-text"
      style={{ backgroundColor: bg }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
      {children}
    </span>
  );
}

function StepCard({
  step,
  icon: Icon,
  iconColor,
  iconBg,
  title,
  body,
}: {
  step: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3 rounded-brand-lg bg-card p-4 shadow-brand">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </span>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider accent-text">
          {step.toString().padStart(2, '0')}
        </p>
        <p className="mt-0.5 text-base font-bold text-brand-text">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-brand-text-muted">{body}</p>
      </div>
    </div>
  );
}

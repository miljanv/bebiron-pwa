'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { LoadingScreen } from '@/components/shared/loading-screen';
import { useBabies } from '@/hooks/use-babies';
import { useBabyStore } from '@/stores/use-baby-store';
import { ActivityTabs } from '@/modules/children/components/activity-tabs';
import { AddEditBabyDialog } from '@/modules/children/components/add-edit-baby-dialog';
import { BabyHeader } from '@/modules/children/components/baby-header';
import { BabySelectorDialog } from '@/modules/children/components/baby-selector-dialog';
import { OverviewList } from '@/modules/children/components/overview-list';
import { ActivityFormDialog } from '@/modules/feeding/components/activity-form-dialog';
import { OnboardingChildForm } from '@/modules/onboarding/components/onboarding-child-form';
import type { ActivityType, Baby } from '@/types';

export function HomeView() {
  const t = useTranslations();
  const { data: babies = [], isLoading } = useBabies();
  const selectedBabyId = useBabyStore((s) => s.selectedBabyId);
  const setSelectedBabyId = useBabyStore((s) => s.setSelectedBabyId);

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editingBaby, setEditingBaby] = useState<Baby | null>(null);
  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);

  const selectedBaby = useMemo(
    () => babies.find((b) => b.id === selectedBabyId) ?? null,
    [babies, selectedBabyId],
  );

  useEffect(() => {
    if (!isLoading && babies.length > 0 && !selectedBabyId) {
      setSelectedBabyId(babies[0]!.id);
    }
    if (selectedBabyId && !babies.some((b) => b.id === selectedBabyId)) {
      setSelectedBabyId(babies[0]?.id ?? null);
    }
  }, [isLoading, babies, selectedBabyId, setSelectedBabyId]);

  if (isLoading && babies.length === 0) {
    return <LoadingScreen />;
  }

  if (babies.length === 0) {
    return <OnboardingChildForm />;
  }

  const handleActivityTabSelect = (type: ActivityType) => {
    if (!selectedBaby) return;
    setActivityType(type);
    setActivityOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-3xl pb-12">
      <div className="px-5 pt-safe lg:pt-8">
        <div className="pt-6">
          <BabyHeader selectedBaby={selectedBaby} onOpen={() => setSelectorOpen(true)} />
        </div>
        <div className="mt-4">
          <ActivityTabs onSelect={handleActivityTabSelect} disabled={!selectedBaby} />
        </div>
      </div>

      <OverviewList selectedBabyId={selectedBabyId} />

      <BabySelectorDialog
        open={selectorOpen}
        babies={babies}
        onClose={() => setSelectorOpen(false)}
        onAddBaby={() => {
          setEditingBaby(null);
          setAddEditOpen(true);
        }}
        onEditBaby={(b) => {
          setEditingBaby(b);
          setAddEditOpen(true);
        }}
      />

      <AddEditBabyDialog
        open={addEditOpen}
        baby={editingBaby}
        onClose={() => {
          setAddEditOpen(false);
          setEditingBaby(null);
        }}
      />

      {activityType && selectedBaby ? (
        <ActivityFormDialog
          open={activityOpen}
          activityType={activityType}
          babyId={selectedBaby.id}
          onClose={() => {
            setActivityOpen(false);
            setActivityType(null);
          }}
        />
      ) : null}

      <span className="sr-only">{t('home.todayOverview')}</span>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { t } from '../lib/translations';
import { Language } from '../app/providers';
import { Accordion } from './Accordion';
import type { CareScheduleItem, PrescribedCare } from '../lib/analysisTypes';

interface NormalizedScheduleItem {
  week: string;
  actions: string[];
}

export default function DetailedCareGuide({ prescribedCare, language }: { prescribedCare: PrescribedCare, language: Language }) {
  const normalizeList = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
    if (typeof value === 'string') {
      return value.split('\n').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const normalizeSchedule = (value: unknown): NormalizedScheduleItem[] => {
    if (!Array.isArray(value)) return [];
    return value
      .filter((item): item is CareScheduleItem => typeof item === 'object' && item !== null)
      .map((item) => {
        const week = item.week || item.day || 'Schedule';
        const actions = Array.isArray(item.actions)
          ? item.actions.filter((entry): entry is string => typeof entry === 'string')
          : [item.action, item.notes].filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
        return { week, actions };
      })
      .filter((item) => item.actions.length > 0);
  };

  const accordionItems = useMemo(() => {
    if (!prescribedCare) return [];
    
    const overviewText = language === 'gujarati' && (prescribedCare as any).overview_gujarati ? (prescribedCare as any).overview_gujarati : prescribedCare.overview;
    const immediateText = language === 'gujarati' && (prescribedCare as any).immediate_actions_gujarati ? (prescribedCare as any).immediate_actions_gujarati : prescribedCare.immediate_actions;
    const environmentText = language === 'gujarati' && (prescribedCare as any).environmental_improvements_gujarati ? (prescribedCare as any).environmental_improvements_gujarati : prescribedCare.environmental_improvements;
    const preventionText = language === 'gujarati' && (prescribedCare as any).prevention_gujarati ? (prescribedCare as any).prevention_gujarati : prescribedCare.prevention;

    return [
      {
        id: 'overview',
        title: t('overview', language),
        content: typeof overviewText === 'string' && overviewText.trim() ? overviewText : 'No overview available yet.'
      },
      {
        id: 'immediate',
        title: t('immediateActions', language),
        items: normalizeList(immediateText)
      },
      {
        id: 'schedule',
        title: t('treatmentSchedule', language),
        schedule: normalizeSchedule(prescribedCare.treatment_schedule)
      },
      {
        id: 'environment',
        title: t('environmentalImprovements', language),
        items: normalizeList(environmentText)
      },
      {
        id: 'prevention',
        title: t('preventionTips', language),
        items: normalizeList(preventionText)
      }
    ];
  }, [prescribedCare, language]);

  if (!prescribedCare) return null;

  return (
    <div className="flex flex-col gap-[var(--space-6)] mt-[var(--space-6)]">
      <div>
        <h2 className="text-[var(--text-xl)] font-semibold text-[var(--ui-text)]">{t('completeCare', language)}</h2>
        <p className="text-[var(--text-sm)] text-[var(--ui-text-muted)]">{t('followGuide', language)}</p>
      </div>

      <Accordion items={accordionItems} defaultOpen="overview" />

      <div className="p-[var(--space-4)] bg-[var(--color-warning)] bg-opacity-10 border-l-4 border-[var(--color-warning)] rounded-r-[var(--radius-md)] text-[var(--text-sm)]">
        <p>
          <strong className="text-[var(--ui-text)]">{t('importantNote', language)}:</strong> {t('recoveryNote', language)}
        </p>
      </div>
    </div>
  );
}
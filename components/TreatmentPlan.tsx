'use client';

import { motion } from 'framer-motion';
import { t } from '../lib/translations';
import { Language } from '../app/providers';
import type { Remedy } from '../lib/analysisTypes';

export default function TreatmentPlan({ remedies, language }: { remedies: Remedy[], language: Language }) {
    if (!remedies || remedies.length === 0) return null;

    return (
        <div className="flex flex-col gap-[var(--space-4)]">
            <h3 className="text-[var(--text-lg)] border-b border-[var(--ui-border)] pb-[var(--space-2)] font-semibold text-[var(--ui-text)]">
                {t('quickActionSteps', language)}
            </h3>

            <div className="grid gap-[var(--space-4)] max-h-[350px] overflow-y-auto pr-[var(--space-2)] custom-scrollbar">
                {remedies.map((remedy, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                        className="flex items-start gap-[var(--space-5)] p-[var(--space-5)] bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-[var(--radius-md)] hover:border-[var(--ui-accent)] transition-colors"
                    >
                        <span className="font-serif text-3xl text-[var(--ui-text-muted)] opacity-40 leading-none mt-1 shrink-0">
                            {(idx + 1).toString().padStart(2, '0')}
                        </span>

                        <div className="flex-1">
                            <h4 className="text-[var(--text-base)] font-semibold mb-[var(--space-2)] text-[var(--ui-text)]">
                                {language === 'gujarati' && (remedy as any).action_gujarati ? (remedy as any).action_gujarati : remedy.action}
                            </h4>
                            <div className="flex flex-wrap gap-x-[var(--space-4)] gap-y-[var(--space-2)] text-[var(--text-sm)] text-[var(--ui-text-muted)]">
                                <span className="flex items-center gap-[var(--space-1)]">
                                    <span className="text-[var(--ui-accent)] opacity-70">⏱</span>
                                    {language === 'gujarati' ? 'સમય' : 'Time'}: {language === 'gujarati' && (remedy as any).timeframe_gujarati ? (remedy as any).timeframe_gujarati : remedy.timeframe}
                                </span>
                                <span className="flex items-center gap-[var(--space-1)]">
                                    <span className="text-[var(--color-success)] opacity-70">✓</span>
                                    {language === 'gujarati' ? 'અસરકારકતા' : 'Effectiveness'}: {remedy.effectiveness}% {t('effective', language)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

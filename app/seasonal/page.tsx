'use client';

import { useState } from 'react';
import type { ComponentType } from 'react';
import { useLanguage } from '../providers';
import { t } from '../../lib/translations';
import { Sun, Droplets, Thermometer, Snowflake } from 'lucide-react';

interface SeasonData {
  id: string;
  titleKey: string;
  Icon: ComponentType<any>;
  color: string;
  tips: string[];
}

const getSeasonData = (language: string): SeasonData[] => [
  {
    id: 'spring',
    titleKey: 'springRenewal',
    Icon: Sun,
    color: 'var(--color-success)',
    tips: language === 'gujarati' ? [
      'નવી વૃદ્ધિ માટે મૃત અથવા ક્ષતિગ્રસ્ત શાખાઓ કાપો',
      'તાજી પોટિંગ માટીથી છોડને ફરીથી પોટ કરો',
      'નિયમિત ખાતર આપવાનું શરૂ કરો',
      'જેમ જેમ દિવસો લાંબા થાય છે તેમ ધીમે ધીમે પાણી વધારો',
      'રોગના ચિહ્નો માટે નવી વૃદ્ધિ પર નજર રાખો'
    ] : [
      'Prune dead or damaged branches to encourage new growth',
      'Repot plants with fresh potting soil',
      'Begin regular fertilizing schedule',
      'Gradually increase watering as days grow longer',
      'Watch new growth for signs of disease'
    ]
  },
  {
    id: 'summer',
    titleKey: 'summerVitality',
    Icon: Droplets,
    color: 'var(--color-warning)',
    tips: language === 'gujarati' ? [
      'ગરમ દિવસોમાં વધુ વખત પાણી આપો',
      'સીધા બપોરના સૂર્યથી રક્ષણ આપો',
      'ભેજ જાળવી રાખવા માટે માટીમાં મલ્ચ ઉમેરો',
      'સક્રિય વૃદ્ધિ દરમિયાન દર 2 અઠવાડિયે ખાતર આપો',
      'જીવાત પ્રવૃત્તિ માટે નિયમિત તપાસ કરો'
    ] : [
      'Water more frequently during hot days',
      'Provide shade from direct afternoon sun',
      'Add mulch to soil to retain moisture',
      'Fertilize every 2 weeks during active growth',
      'Check regularly for pest activity'
    ]
  },
  {
    id: 'fall',
    titleKey: 'fallPreparation',
    Icon: Thermometer,
    color: '#D4AF6F',
    tips: language === 'gujarati' ? [
      'ઠંડા હવામાન પહેલાં બહારના છોડ અંદર ખસેડો',
      'ખાતરની આવર્તન ધીમે ધીમે ઘટાડો',
      'ઠંડા તાપમાનને અનુકૂલન માટે પાણી ઘટાડો',
      'શિયાળાની નિષ્ક્રિયતા માટે છોડ તૈયાર કરો',
      'મૂળ મજબૂત કરવા માટે ફોસ્ફરસ-ભારે ખાતર વાપરો'
    ] : [
      'Move outdoor plants inside before cold weather',
      'Gradually reduce fertilizing frequency',
      'Decrease watering to adapt to cooler temperatures',
      'Prepare plants for winter dormancy',
      'Use phosphorus-heavy fertilizer to strengthen roots'
    ]
  },
  {
    id: 'winter',
    titleKey: 'winterDormancy',
    Icon: Snowflake,
    color: 'var(--ui-text-muted)',
    tips: language === 'gujarati' ? [
      'ખાતર આપવાનું ઓછું કરો અથવા બંધ કરો',
      'માત્ર ત્યારે જ પાણી આપો જ્યારે માટી સંપૂર્ણ સૂકી હોય',
      'ડ્રાફ્ટ અને હીટિંગ વેન્ટ્સથી છોડને દૂર રાખો',
      'જો ઉપલબ્ધ હોય તો વધારાનો પ્રકાશ આપો',
      'ભેજ વધારવા માટે છોડને એકસાથે જૂથબદ્ધ કરો'
    ] : [
      'Reduce or stop fertilizing entirely',
      'Water only when soil is completely dry',
      'Keep plants away from drafts and heating vents',
      'Provide supplemental lighting if available',
      'Group plants together to increase humidity'
    ]
  }
];

export default function SeasonalPage() {
  const { language } = useLanguage();
  const [activeSeason, setActiveSeason] = useState('spring');
  const seasons = getSeasonData(language);
  const currentSeason = seasons.find(s => s.id === activeSeason) || seasons[0];

  return (
    <div className="w-full mx-auto p-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] pb-[var(--space-16)] min-h-screen">
      <div className="pt-[var(--space-6)] pb-[var(--space-8)]">
        <h1 className="text-[var(--text-3xl)] font-bold text-[var(--ui-text)] mb-[var(--space-2)]">
          {t('seasonalCareGuide', language)}
        </h1>
        <p className="text-[var(--text-base)] text-[var(--ui-text-muted)]">
          {language === 'gujarati' ? 'દરેક મોસમ માટે ચોક્કસ સંભાળ ભલામણો' : 'Specific care recommendations for each season'}
        </p>
      </div>

      {/* Season Tabs */}
      <div className="flex flex-row flex-nowrap items-center w-full sm:w-fit mb-[var(--space-8)] p-[var(--space-4)] bg-[var(--ui-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--ui-border)] overflow-x-auto gap-6">
        {seasons.map((season) => {
          const isActive = activeSeason === season.id;
          return (
            <button
              key={season.id}
              onClick={() => setActiveSeason(season.id)}
              className={`flex-1 sm:flex-none flex flex-row items-center justify-center gap-[var(--space-2)] px-[var(--space-6)] py-[var(--space-6)] rounded-[var(--radius-md)] text-[14px] font-medium transition-all outline-none whitespace-nowrap ${
                isActive 
                  ? 'bg-[var(--ui-surface)] text-[var(--ui-text)] shadow-sm border border-[var(--ui-border)]' 
                  : 'text-[var(--ui-text-muted)] border border-transparent hover:text-[var(--ui-text)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <div 
                className={`flex items-center justify-center shrink-0 transition-transform duration-300 gap-6 ${isActive ? 'scale-110 drop-shadow-sm' : ''}`}
                style={{ color: isActive ? season.color : 'currentColor' }}
              >
                <season.Icon size={18} fill={isActive ? "currentColor" : "none"} />
              </div>
              <span className="leading-none mt-[2px]">{t(season.id, language)}</span>
            </button>
          );
        })}
      </div>

      {/* Active Season Content */}
      <div className="border border-[var(--ui-border)] rounded-[var(--radius-xl)] bg-[var(--ui-surface)] p-[var(--space-6)] md:p-[var(--space-8)]">
        <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-8)] pb-[var(--space-4)] border-b border-[var(--ui-border)]">
          <div 
            className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--ui-surface-muted)] border border-[var(--ui-border)] flex items-center justify-center"
            style={{ color: currentSeason.color }}
          >
            <currentSeason.Icon size={24} fill="currentColor" />
          </div>
          <h2 className="text-[var(--text-2xl)] font-medium text-[var(--ui-text)]">
            {t(currentSeason.titleKey, language)}
          </h2>
        </div>

        <div className="flex flex-col gap-[var(--space-4)]">
          {currentSeason.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-[var(--space-3)] p-[var(--space-4)] bg-[var(--ui-surface-muted)] rounded-[var(--radius-md)] border border-[var(--ui-border)]">
              <span className="font-mono text-[var(--text-sm)] text-[var(--ui-text-muted)] shrink-0 opacity-60">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              <p className="text-[var(--text-sm)] text-[var(--ui-text)] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

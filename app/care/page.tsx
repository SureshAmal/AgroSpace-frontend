'use client';

import { useLanguage } from '../providers';
import { t } from '../../lib/translations';
import { SunIcon, WaterIcon, EarthIcon, TemperatureIcon, NutritionIcon, BugIcon, CheckIcon } from '../../components/SeasonalIcons';

const getBasicTips = (language: string) => [
  {
    category: language === 'gujarati' ? 'પ્રકાશ' : 'Lighting',
    Icon: SunIcon,
    tips: language === 'gujarati' ? [
      'છોડને દરરોજ 6-8 કલાક માટે તેજસ્વી, પરોક્ષ પ્રકાશમાં મૂકો',
      'બધી બાજુએ સમાન વૃદ્ધિ સુનિશ્ચિત કરવા માટે સાપ્તાહિક પોટ ફેરવો',
      'પાંદડાને બળીથી બચાવવા માટે છોડને સીધા કઠોર બપોરના સૂર્યથી દૂર રાખો',
      'ઓછા પ્રકાશ વિસ્તારો માટે, ગ્રો લાઇટ્સ અથવા ઓછા પ્રકાશ સહન કરતા છોડનો વિચાર કરો'
    ] : [
      'Place plants in bright, indirect light for 6-8 hours daily',
      'Rotate pots weekly to ensure even growth on all sides',
      'Keep plants away from direct harsh afternoon sun to prevent leaf burn',
      'For low-light areas, consider grow lights or low-light tolerant plants'
    ]
  },
  {
    category: language === 'gujarati' ? 'પાણી આપવું' : 'Watering',
    Icon: WaterIcon,
    tips: language === 'gujarati' ? [
      'જ્યારે માટીનો ઉપરનો ઇંચ સૂકો લાગે ત્યારે પાણી આપો',
      'મૂળને આઘાત ટાળવા માટે ઓરડાના તાપમાનનું પાણી વાપરો',
      'જ્યાં સુધી તે તળિયેના છિદ્રોમાંથી બહાર ન નીકળે ત્યાં સુધી પાણી આપો',
      'સવારે પાણી આપવું આદર્શ છે; ફંગલ સમસ્યાઓ અટકાવવા માટે પાંદડાને ભીંજવવાનું ટાળો'
    ] : [
      'Water when the top inch of soil feels dry to the touch',
      'Use room-temperature water to avoid shocking the roots',
      'Water until it drains from the bottom holes, then empty the saucer',
      'Morning watering is ideal; avoid wetting leaves to prevent fungal issues'
    ]
  },
  {
    category: language === 'gujarati' ? 'માટી અને પોટિંગ' : 'Soil & Potting',
    Icon: EarthIcon,
    tips: language === 'gujarati' ? [
      'પર્લાઇટ અથવા ઓર્કિડ છાલ સાથે સારી ડ્રેનેજ પોટિંગ મિશ્રણનો ઉપયોગ કરો',
      'મૂળ સડો અટકાવવા માટે ડ્રેનેજ છિદ્રો સાથેના પોટ પસંદ કરો',
      'વસંતમાં છોડને ફરીથી પોટ કરો જ્યારે તેઓ તેમના કન્ટેનરથી વધી જાય'
    ] : [
      'Use well-draining potting mix with added perlite or orchid bark',
      'Choose pots with drainage holes to prevent root rot',
      'Repot plants in spring when they outgrow their containers'
    ]
  },
  {
    category: language === 'gujarati' ? 'ભેજ અને તાપમાન' : 'Humidity & Temperature',
    Icon: TemperatureIcon,
    tips: language === 'gujarati' ? [
      'મોટાભાગના ઘરના છોડ 40-60% ભેજ સ્તર પસંદ કરે છે',
      'સાપ્તાહિક પાંદડાને ધુમ્મસ આપો અથવા પાણીથી ભરેલા કાંકરા ટ્રે પર મૂકો',
      'છોડને હીટિંગ વેન્ટ્સ, એર કન્ડીશનર અને ઠંડા ડ્રાફ્ટથી દૂર રાખો'
    ] : [
      'Most houseplants prefer 40-60% humidity levels',
      'Mist leaves weekly or place on pebble trays filled with water',
      'Keep plants away from heating vents, air conditioners, and cold drafts'
    ]
  },
  {
    category: language === 'gujarati' ? 'ખોરાક અને પોષક તત્વો' : 'Feeding & Nutrients',
    Icon: NutritionIcon,
    tips: language === 'gujarati' ? [
      'વૃદ્ધિ સીઝન દરમિયાન દર 2-4 અઠવાડિયામાં છોડને ખવડાવો',
      'સામાન્ય સંભાળ માટે સંતુલિત ખાતર (10-10-10) નો ઉપયોગ કરો',
      'પાનખર અને શિયાળાની નિષ્ક્રિયતામાં ખાતર ઘટાડો અથવા બંધ કરો'
    ] : [
      'Feed plants during growing season (spring/summer) every 2-4 weeks',
      'Use balanced fertilizer (like 10-10-10) for general care',
      'Reduce or stop fertilizing in fall and winter dormancy'
    ]
  },
  {
    category: language === 'gujarati' ? 'જીવાત નિવારણ' : 'Pest Prevention',
    Icon: BugIcon,
    tips: language === 'gujarati' ? [
      'જીવાતો ટાળવા માટે છોડને ઘરે લાવતા પહેલા તપાસો',
      'ધૂળ દૂર કરવા માટે મહિનામાં એકવાર પાંદડા સાફ કરો',
      'કોઈપણ ચેપગ્રસ્ત છોડને તરત જ અલગ કરો'
    ] : [
      'Inspect new plants before bringing them home to avoid pests',
      'Wipe leaves monthly with a soft, damp cloth to remove dust',
      'Isolate any infested plant immediately from other plants'
    ]
  },
  {
    category: language === 'gujarati' ? 'સામાન્ય દિનચર્યા' : 'General Routine',
    Icon: CheckIcon,
    tips: language === 'gujarati' ? [
      'અઠવાડિયામાં 2-3 વખત માટીની ભેજ તપાસો',
      'જીવાતો માટે સાપ્તાહિક પાંદડા અને દાંડીઓનું નિરીક્ષણ કરો',
      'મૃત અથવા પીળા પાંદડાને તરત કાપો'
    ] : [
      'Check soil moisture 2-3 times per week',
      'Inspect leaves and stems weekly for pests or disease',
      'Prune dead or yellowing leaves promptly'
    ]
  }
];

export default function CarePage() {
  const { language } = useLanguage();
  const tips = getBasicTips(language);

  return (
    <div className="w-full mx-auto p-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] pb-[var(--space-16)] min-h-screen">
      <div className="pt-[var(--space-6)] pb-[var(--space-8)]">
        <h1 className="text-[var(--text-3xl)] font-bold text-[var(--ui-text)] mb-[var(--space-2)]">
          {t('essentialPlantCare', language)}
        </h1>
        <p className="text-[var(--text-base)] text-[var(--ui-text-muted)]">
          {language === 'gujarati' ? 'તમારા છોડને સ્વસ્થ અને સુંદર રાખવા માટેની આવશ્યક માર્ગદર્શિકા' : 'Essential guide to keeping your plants healthy and beautiful'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-6)] lg:gap-[var(--space-8)]">
        {tips.map((category, idx) => {
          const Icon = category.Icon;
          return (
            <div key={idx} className="border border-[var(--ui-border)] rounded-[var(--radius-xl)] bg-[var(--ui-surface)] p-[var(--space-6)] md:p-[var(--space-8)] hover:border-[var(--ui-accent)] transition-colors group">
              <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-6)] pb-[var(--space-4)] border-b border-[var(--ui-border)]">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--ui-surface-muted)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--ui-text)] group-hover:text-[var(--ui-accent)] transition-colors">
                  <Icon size={24} />
                </div>
                <h2 className="text-[var(--text-xl)] font-medium text-[var(--ui-text)]">{category.category}</h2>
              </div>
              <ul className="flex flex-col gap-[var(--space-3)]">
                {category.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="flex items-start gap-[var(--space-2)] text-[var(--text-sm)] text-[var(--ui-text-muted)] leading-relaxed">
                    <span className="text-[var(--ui-accent)] mt-1 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

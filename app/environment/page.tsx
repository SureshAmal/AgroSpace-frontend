'use client';

import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { useLanguage } from '../providers';
import { t } from '../../lib/translations';
import { CloudIcon, WindIcon, TemperatureIcon, WaterIcon } from '../../components/SeasonalIcons';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  location?: string;
  feels_like?: number;
  rainfall?: number;
  cloudiness?: number;
  pressure?: number;
  sunrise?: string;
  sunset?: string;
}

interface SoilData {
  moisture: number;
  temperature?: number;
  ph: number;
  nitrogen: string | number;
  phosphorus: string | number;
  potassium: string | number;
  organicMatter?: string | number;
  texture?: string;
  source?: string;
}

interface StatCardProps {
  icon: ComponentType<{ size?: number }>;
  label: string;
  value: string | number;
  unit?: string;
}

function StatCard({ icon: Icon, label, value, unit }: StatCardProps) {
  return (
    <div className="flex items-center gap-[var(--space-4)] p-[var(--space-4)] md:p-[var(--space-5)] bg-[var(--ui-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--ui-border)] hover:border-[var(--ui-accent)] transition-colors group">
      <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--ui-surface)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--ui-text-muted)] group-hover:text-[var(--ui-accent)] group-hover:border-[var(--ui-accent)] transition-colors shrink-0 shadow-sm">
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider mb-0.5 truncate">{label}</p>
        <p className="text-[var(--text-xl)] font-bold text-[var(--ui-text)] truncate">{value}<span className="text-[var(--text-sm)] text-[var(--ui-text-muted)] font-medium ml-0.5">{unit}</span></p>
      </div>
    </div>
  );
}

export default function EnvironmentPage() {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);

  useEffect(() => {
    const fetchEnvironmentalData = async () => {
      try {
        const [weatherRes, soilRes] = await Promise.all([
          fetch('/api/environment/weather'),
          fetch('/api/environment/soil')
        ]);
        
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          setWeather({
            temperature: wData.temperature,
            feels_like: wData.feels_like,
            humidity: wData.humidity,
            description: wData.description,
            windSpeed: wData.wind_speed,
            rainfall: wData.rainfall,
            cloudiness: wData.cloudiness,
            pressure: wData.pressure,
            sunrise: wData.sunrise,
            sunset: wData.sunset
          });
        }
        
        if (soilRes.ok) {
          const sData = await soilRes.json();
          setSoil({
            ph: sData.ph,
            nitrogen: sData.nitrogen,
            phosphorus: sData.phosphorus,
            potassium: sData.potassium,
            organicMatter: sData.organic_matter,
            texture: sData.texture,
            moisture: sData.moisture,
            source: sData.source
          });
        }
      } catch (e) {
        console.error('Failed to fetch environmental data:', e);
      }
    };
    fetchEnvironmentalData();
  }, []);

  // Fallback demo data
  const weatherDisplay = weather || {
    temperature: 28,
    feels_like: 30,
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    rainfall: 0,
    sunrise: '06:30',
    sunset: '18:45',
    description: language === 'gujarati' ? 'આંશિક વાદળછાયું' : 'Partly Cloudy',
    location: language === 'gujarati' ? 'અમદાવાદ, ગુજરાત' : 'Ahmedabad, Gujarat'
  };

  const soilDisplay = soil || {
    moisture: 42,
    temperature: 24,
    ph: 6.5,
    nitrogen: language === 'gujarati' ? 'મધ્યમ' : 'Medium',
    phosphorus: language === 'gujarati' ? 'ઉચ્ચ' : 'High',
    potassium: language === 'gujarati' ? 'ઓછું' : 'Low',
    organicMatter: '2.5%',
    texture: language === 'gujarati' ? 'માટીવાળી ગોરાડુ' : 'Clay Loam',
    source: 'Ambee Soil API'
  };

  const getRecommendations = () => {
    const recs = [];
    
    // Weather Recs
    if (weatherDisplay.humidity > 70) {
      recs.push({ type: 'warning', text: language === 'gujarati' ? `ઊંચી ભેજ (${weatherDisplay.humidity}%) - ફંગલ રોગોનું જોખમ વધારે. સારું હવા પરિભ્રમણ સુનિશ્ચિત કરો અને ઉપરથી પાણી આપવાનું ટાળો.` : `High humidity (${weatherDisplay.humidity}%) - Increased risk of fungal diseases. Ensure good air circulation and avoid overhead watering.` });
    } else if (weatherDisplay.humidity < 50) {
      recs.push({ type: 'advice', text: language === 'gujarati' ? `ઓછી ભેજ (${weatherDisplay.humidity}%) - માટીની ભેજ જાળવવા માટે મલ્ચિંગ પર વિચાર કરો અને પાણીની આવર્તન વધારો.` : `Low humidity (${weatherDisplay.humidity}%) - Consider mulching to retain soil moisture and increase watering frequency.` });
    } else {
      recs.push({ type: 'success', text: language === 'gujarati' ? `શ્રેષ્ઠ ભેજ (${weatherDisplay.humidity}%) - મોટાભાગના પાકો માટે સારી પરિસ્થિતિઓ. વર્તમાન સિંચાઈ શેડ્યૂલ જાળવો.` : `Optimal humidity (${weatherDisplay.humidity}%) - Good conditions for most crops. Maintain current irrigation schedule.` });
    }

    if (weatherDisplay.temperature > 35) {
      recs.push({ type: 'warning', text: language === 'gujarati' ? `ઊંચું તાપમાન (${weatherDisplay.temperature}°C) - પૂરતી સિંચાઈ સુનિશ્ચિત કરો, સંવેદનશીલ પાકો માટે છાયા જાળી પર વિચાર કરો.` : `High temperature (${weatherDisplay.temperature}°C) - Ensure adequate irrigation, consider shade nets for sensitive crops.` });
    } else if (weatherDisplay.temperature < 20) {
      recs.push({ type: 'advice', text: language === 'gujarati' ? `ઠંડું તાપમાન (${weatherDisplay.temperature}°C) - હિમથી સંવેદનશીલ છોડને સુરક્ષિત કરો, ઠંડી-મોસમના પાકો માટે આદર્શ.` : `Cool temperature (${weatherDisplay.temperature}°C) - Protect frost-sensitive plants, ideal for cool-season crops.` });
    }

    if (weatherDisplay.rainfall > 0) {
      recs.push({ type: 'advice', text: language === 'gujarati' ? `તાજેતરનો વરસાદ (${weatherDisplay.rainfall}mm) - સિંચાઈ ઘટાડો, પાણી ભરાવા માટે નિરીક્ષણ કરો.` : `Recent rainfall (${weatherDisplay.rainfall}mm) - Reduce irrigation, monitor for waterlogging.` });
    }

    // Soil Recs
    if (soilDisplay.ph < 6.0) {
      recs.push({ type: 'warning', text: language === 'gujarati' ? `એસિડિક માટી (pH ${soilDisplay.ph}) - મોટાભાગના પાકો માટે pH વધારવા માટે ચૂનો ઉમેરો.` : `Acidic soil (pH ${soilDisplay.ph}) - Add lime to raise pH for most crops.` });
    } else if (soilDisplay.ph > 7.5) {
      recs.push({ type: 'advice', text: language === 'gujarati' ? `આલ્કલાઈન માટી (pH ${soilDisplay.ph}) - જરૂર હોય તો pH ઘટાડવા માટે સલ્ફર અથવા કાર્બનિક પદાર્થ ઉમેરો.` : `Alkaline soil (pH ${soilDisplay.ph}) - Add sulfur or organic matter to lower pH if needed.` });
    } else {
      recs.push({ type: 'success', text: language === 'gujarati' ? `શ્રેષ્ઠ pH (${soilDisplay.ph}) - મોટાભાગના પાકો માટે સંપૂર્ણ શ્રેણી.` : `Optimal pH (${soilDisplay.ph}) - Perfect range for most crops.` });
    }

    if (soilDisplay.nitrogen.toLowerCase() === 'low' || soilDisplay.nitrogen === 'ઓછું') {
      recs.push({ type: 'warning', text: language === 'gujarati' ? 'ઓછું નાઇટ્રોજન - પાંદડાની વૃદ્ધિ વધારવા માટે નાઇટ્રોજન-સમૃદ્ધ ખાતર લાગુ કરો.' : 'Low nitrogen - Apply nitrogen-rich fertilizer to boost leafy growth.' });
    }
    
    if (soilDisplay.phosphorus.toLowerCase() === 'low' || soilDisplay.phosphorus === 'ઓછું') {
      recs.push({ type: 'warning', text: language === 'gujarati' ? 'ઓછું ફોસ્ફરસ - મૂળના વિકાસ અને ફૂલ માટે બોન મીલ અથવા રોક ફોસ્ફેટ લાગુ કરો.' : 'Low phosphorus - Apply bone meal or rock phosphate for root development and flowering.' });
    }
    
    if (soilDisplay.potassium.toLowerCase() === 'low' || soilDisplay.potassium === 'ઓછું') {
      recs.push({ type: 'warning', text: language === 'gujarati' ? 'ઓછું પોટેશિયમ - રોગ પ્રતિકાર અને ફળની ગુણવત્તા માટે પોટાશ અથવા લાકડાની રાખ ઉમેરો.' : 'Low potassium - Add potash or wood ash for disease resistance and fruit quality.' });
    }

    return recs;
  };
  
  const recommendations = getRecommendations();

  return (
    <div className="w-full mx-auto p-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] pb-[var(--space-16)] min-h-screen">
      <div className="pt-[var(--space-6)] pb-[var(--space-8)]">
        <h1 className="text-[var(--text-3xl)] font-bold text-[var(--ui-text)] mb-[var(--space-2)]">
          {t('weatherSoilData', language)}
        </h1>
        <p className="text-[var(--text-base)] text-[var(--ui-text-muted)]">
          {language === 'gujarati' ? 'તમારા સ્થાન માટે રીઅલ-ટાઇમ પર્યાવરણીય માહિતી' : 'Real-time environmental data for your location'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-6)] lg:gap-[var(--space-8)]">
        {/* Weather Card */}
        <div className="border border-[var(--ui-border)] rounded-[var(--radius-xl)] bg-[var(--ui-surface)] p-[var(--space-6)] md:p-[var(--space-8)] w-full">
          <div className="flex items-center justify-between mb-[var(--space-6)] pb-[var(--space-4)] border-b border-[var(--ui-border)]">
            <div className="flex items-center gap-[var(--space-3)]">
              <div className="w-10 h-10 rounded-full bg-[var(--ui-surface-muted)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--ui-text)]">
                <CloudIcon size={20} />
              </div>
              <h2 className="text-[var(--text-xl)] font-medium text-[var(--ui-text)]">{t('currentWeather', language)}</h2>
            </div>
            <p className="text-[var(--text-sm)] font-medium bg-[var(--ui-surface-muted)] px-[var(--space-3)] py-[var(--space-1)] rounded-full border border-[var(--ui-border)] text-[var(--ui-text-muted)]">{weatherDisplay.location}</p>
          </div>

          <div className="mb-[var(--space-8)] flex items-end gap-[var(--space-3)]">
            <p className="text-[3rem] leading-none font-bold text-[var(--ui-text)] tracking-tight">{weatherDisplay.temperature}°</p>
            <p className="text-[var(--text-lg)] text-[var(--ui-text-muted)] mb-1">{weatherDisplay.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--space-3)]">
            <StatCard icon={TemperatureIcon} label={t('temperature', language)} value={weatherDisplay.temperature} unit="°C" />
            <StatCard icon={WaterIcon} label={t('humidity', language)} value={weatherDisplay.humidity} unit="%" />
            <StatCard icon={WindIcon} label={t('windSpeed', language)} value={weatherDisplay.windSpeed} unit=" km/h" />
            <StatCard icon={TemperatureIcon} label={language === 'gujarati' ? 'લાગે છે' : 'Feels Like'} value={weatherDisplay.feels_like || weatherDisplay.temperature} unit="°C" />
          </div>
          {(weatherDisplay.pressure || weatherDisplay.rainfall !== undefined || weatherDisplay.sunrise) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--space-3)] mt-[var(--space-3)]">
              {weatherDisplay.pressure && <StatCard icon={CloudIcon} label={language === 'gujarati' ? 'દબાણ' : 'Pressure'} value={weatherDisplay.pressure} unit=" hPa" />}
              {weatherDisplay.rainfall !== undefined && <StatCard icon={WaterIcon} label={language === 'gujarati' ? 'વરસાદ' : 'Rainfall'} value={weatherDisplay.rainfall} unit=" mm" />}
              {weatherDisplay.sunrise && <div className="flex flex-col justify-center px-[var(--space-4)] py-[var(--space-3)] bg-[var(--ui-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--ui-border)]"><span className="text-[10px] sm:text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider mb-0.5">{language === 'gujarati' ? 'સૂર્યોદય' : 'Sunrise'}</span><span className="font-semibold text-[var(--ui-text)]">{weatherDisplay.sunrise}</span></div>}
              {weatherDisplay.sunset && <div className="flex flex-col justify-center px-[var(--space-4)] py-[var(--space-3)] bg-[var(--ui-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--ui-border)]"><span className="text-[10px] sm:text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider mb-0.5">{language === 'gujarati' ? 'સૂર્યાસ્ત' : 'Sunset'}</span><span className="font-semibold text-[var(--ui-text)]">{weatherDisplay.sunset}</span></div>}
            </div>
          )}
        </div>

        {/* Soil Card */}
        <div className="border border-[var(--ui-border)] rounded-[var(--radius-xl)] bg-[var(--ui-surface)] p-[var(--space-6)] md:p-[var(--space-8)] w-full">
          <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-6)] pb-[var(--space-4)] border-b border-[var(--ui-border)]">
            <div className="w-10 h-10 rounded-full bg-[var(--ui-surface-muted)] border border-[var(--ui-border)] flex items-center justify-center text-[var(--color-warning)]">
              <WaterIcon size={20} />
            </div>
            <h2 className="text-[var(--text-xl)] font-medium text-[var(--ui-text)]">{t('soilData', language)}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-3)]">
            <StatCard icon={WaterIcon} label={t('soilMoisture', language)} value={soilDisplay.moisture} unit="%" />
            <StatCard icon={TemperatureIcon} label={t('soilTemperature', language)} value={soilDisplay.temperature} unit="°C" />
          </div>

          <div className="mt-[var(--space-4)] p-[var(--space-5)] bg-[var(--ui-surface-muted)] rounded-[var(--radius-lg)] border border-[var(--ui-border)]">
            <div className="flex items-center justify-between mb-[var(--space-4)]">
              <p className="text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider font-semibold">{t('phLevel', language)}</p>
              <div className="px-3 py-1 bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-full text-[var(--text-sm)] font-bold shadow-sm">{soilDisplay.ph}</div>
            </div>
            <div className="grid grid-cols-3 gap-[var(--space-4)] pt-[var(--space-4)] border-t border-[var(--ui-border)] border-dashed">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider">{t('nitrogen', language)}</p>
                <p className="text-[var(--text-base)] font-bold text-[var(--ui-text)]">{soilDisplay.nitrogen}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider">{t('phosphorus', language)}</p>
                <p className="text-[var(--text-base)] font-bold text-[var(--ui-text)]">{soilDisplay.phosphorus}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider">{t('potassium', language)}</p>
                <p className="text-[var(--text-base)] font-bold text-[var(--ui-text)]">{soilDisplay.potassium}</p>
              </div>
            </div>
            {(soilDisplay.organicMatter || soilDisplay.texture) && (
              <div className="grid grid-cols-2 gap-[var(--space-4)] pt-[var(--space-4)] border-t border-[var(--ui-border)] border-dashed mt-[var(--space-4)]">
                {soilDisplay.texture && (
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider">{language === 'gujarati' ? 'માટીનો પ્રકાર' : 'Soil Type'}</p>
                    <p className="text-[var(--text-sm)] font-medium text-[var(--ui-text)]">{soilDisplay.texture}</p>
                  </div>
                )}
                {soilDisplay.organicMatter && (
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] text-[var(--ui-text-muted)] uppercase tracking-wider">{language === 'gujarati' ? 'કાર્બનિક પદાર્થ' : 'Organic Matter'}</p>
                    <p className="text-[var(--text-sm)] font-medium text-[var(--ui-text)]">{soilDisplay.organicMatter}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-[var(--space-6)] lg:mt-[var(--space-8)] border border-[var(--ui-border)] rounded-[var(--radius-xl)] bg-[var(--ui-surface)] p-[var(--space-6)] md:p-[var(--space-8)] w-full">
        <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-6)] pb-[var(--space-4)] border-b border-[var(--ui-border)]">
          <h2 className="text-[var(--text-xl)] font-medium text-[var(--ui-text)] m-0">{t('recommendations', language)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-4)]">
          {recommendations.map((rec, idx) => {
            const borderColors = {
              success: 'border-[var(--color-success)]',
              warning: 'border-[var(--color-warning)]',
              advice: 'border-[var(--color-info)]'
            };
            const bgColors = {
              success: 'bg-[var(--color-success)]',
              warning: 'bg-[var(--color-warning)]',
              advice: 'bg-[var(--color-info)]'
            };
            const textColors = {
              success: 'text-[var(--color-success)]',
              warning: 'text-[var(--color-warning)]',
              advice: 'text-[var(--color-info)]'
            };
            const iconSvg = {
              success: <polyline points="20 6 9 17 4 12"></polyline>,
              warning: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></>,
              advice: <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></>
            };

            return (
              <div key={idx} className={`flex items-start gap-[var(--space-3)] p-[var(--space-5)] bg-[var(--ui-surface-muted)] rounded-[var(--radius-md)] border border-[var(--ui-border)] hover:${borderColors[rec.type as keyof typeof borderColors]} transition-colors group`}>
                <div className={`w-6 h-6 rounded-full ${bgColors[rec.type as keyof typeof bgColors]} bg-opacity-10 ${textColors[rec.type as keyof typeof textColors]} flex items-center justify-center shrink-0 mt-0.5`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{iconSvg[rec.type as keyof typeof iconSvg]}</svg>
                </div>
                <p className="text-[var(--text-sm)] text-[var(--ui-text)] leading-relaxed">{rec.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

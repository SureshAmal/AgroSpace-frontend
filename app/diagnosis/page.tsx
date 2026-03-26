'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../providers';
import { t } from '../../lib/translations';
import UploadZone from '../../components/UploadZone';
import TreatmentPlan from '../../components/TreatmentPlan';
import DetailedCareGuide from '../../components/DetailedCareGuide';
import { GlobeIcon, DownloadIcon, RefreshIcon, WarningIcon, ArrowLeftIcon } from '../../components/Icons';
import type { AnalysisResult } from '../../lib/analysisTypes';

interface HistoryEntry {
    id: string;
    thumbnail: string;
    disease: string;
    plantName: string;
    severity: string;
    confidence: number;
    timestamp: number;
    image: string;
    result: AnalysisResult;
}

const HISTORY_KEY = 'agrosense_diagnosis_history';
const MAX_HISTORY = 10;

function loadHistory(): HistoryEntry[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveToHistory(image: string, result: AnalysisResult) {
    const history = loadHistory();
    const entry: HistoryEntry = {
        id: Date.now().toString(),
        thumbnail: image,
        disease: result.disease || 'Unknown',
        plantName: result.plant_name || 'Unknown Plant',
        severity: result.severity || 'low',
        confidence: result.confidence || 0,
        timestamp: Date.now(),
        image,
        result
    };
    const updated = [entry, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
}

export default function DiagnosisPage() {
    const { language } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [pdfLanguage, setPdfLanguage] = useState<'english' | 'gujarati'>('english');
    const [isDownloading, setIsDownloading] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setHistory(loadHistory());
    }, []);

    const restoreFromHistory = (entry: HistoryEntry) => {
        setImage(entry.image);
        setResult(entry.result);
    };

    const handleImageSelected = async (imgStr: string) => {
        setImage(imgStr);
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imgStr })
            });
            
            const text = await response.text();
            let data: unknown;
            try {
                data = JSON.parse(text);
            } catch {
                console.error('Server returned non-JSON:', text);
                setResult(null);
                return;
            }
            
            if (response.ok) {
                const parsed = data as AnalysisResult;
                setResult(parsed);
                const updated = saveToHistory(imgStr, parsed);
                setHistory(updated);
            } else {
                const errData = data as { error?: string };
                console.error('Analysis failed:', errData.error);
                setResult(null);
            }
        } catch (error) {
            console.error('Network Error:', error);
            setResult(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setImage(null);
        setResult(null);
    };

    const handleDownload = async (lang: string) => {
        if (!result || !image) return;
        setIsDownloading(true);
        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: lang,
                    disease: result.disease,
                    description: result.description,
                    remedies: result.remedies,
                    confidence: result.confidence,
                    severity: result.severity,
                    plant_name: result.plant_name,
                    seasonal_tips: result.seasonal_tips,
                    prescribed_care: result.prescribed_care
                }),
            });

            if (!response.ok) {
                console.error('Failed to generate PDF');
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AgroSense_Report_${lang}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const getSeverityColor = (imp: string) => {
        switch (imp) {
            case 'critical': return 'var(--color-error)';
            case 'high': return '#E8A891';
            case 'medium': return 'var(--color-warning)';
            default: return 'var(--color-success)';
        }
    };

    if (!image && !isAnalyzing) {
        return (
            <div className="w-full mx-auto p-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] pb-[var(--space-16)] h-full">
                <div className="pt-[var(--space-4)] pb-[var(--space-6)]">
                    <h1 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] font-bold text-[var(--ui-text)] mb-[var(--space-2)]">
                        {language === 'gujarati' ? 'છોડનું નિદાન' : 'Plant Diagnosis'}
                    </h1>
                    <p className="text-[var(--text-base)] text-[var(--ui-text-muted)]">
                        {language === 'gujarati' ? 'તમારા છોડનો ફોટો અપલોડ કરો અને AI તરત જ તેનું નિદાન કરશે.' : 'Upload a photo of your plant and the AI will analyze its health instantly.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)] gap-[var(--space-5)] lg:gap-[var(--space-6)] items-start">
                        <div className="border border-[var(--ui-border)] rounded-[var(--radius-xl)] bg-[var(--ui-surface)] p-[var(--space-5)] w-full flex flex-col lg:sticky lg:top-[var(--space-6)] h-fit">
                        <div className="mb-[var(--space-4)] flex flex-col gap-[var(--space-2)]">
                            <h2 className="text-[var(--text-lg)] font-semibold text-[var(--ui-text)]">
                                {language === 'gujarati' ? 'નવો સ્કેન' : 'New Scan'}
                            </h2>
                            <p className="text-[var(--text-sm)] text-[var(--ui-text-muted)]">
                                {language === 'gujarati' ? 'સ્પષ્ટ પાંદડા/ડાંડીનો ક્લોઝ-અપ અપલોડ કરો' : 'Upload a clear close-up of leaf or stem'}
                            </p>
                        </div>

                        <UploadZone
                            onImageSelected={handleImageSelected}
                            className="aspect-square w-full"
                        />

                        <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] text-[var(--text-xs)] text-[var(--ui-text-muted)]">
                            <div className="border border-[var(--ui-border)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)]">{language === 'gujarati' ? 'સારા પ્રકાશમાં ફોટો લો' : 'Use natural light'}</div>
                            <div className="border border-[var(--ui-border)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)]">{language === 'gujarati' ? 'અસરગ્રસ્ત ભાગ પર ફોકસ કરો' : 'Focus on affected area'}</div>
                            <div className="border border-[var(--ui-border)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)]">{language === 'gujarati' ? 'ધૂંધળી છબીઓ ટાળો' : 'Avoid blurry images'}</div>
                        </div>
                    </div>

                    <aside className="border border-[var(--ui-border)] rounded-[var(--radius-xl)] bg-[var(--ui-surface)] p-[var(--space-5)] w-full min-h-[500px]">
                        <div className="flex items-center justify-between mb-[var(--space-5)] pb-[var(--space-3)] border-b border-[var(--ui-border)]">
                            <h2 className="text-[var(--text-lg)] font-semibold text-[var(--ui-text)]">
                                {language === 'gujarati' ? 'ઇમેજ ગેલેરી' : 'Image Gallery'}
                            </h2>
                            <span className="text-[var(--text-sm)] text-[var(--ui-text-muted)] border border-[var(--ui-border)] px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-md)]">
                                {history.length} {language === 'gujarati' ? 'સ્કેન્સ' : 'scans'}
                            </span>
                        </div>
                        
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-[var(--ui-text-muted)] text-[var(--text-sm)]">
                                <span className="mb-[var(--space-2)]">🌱</span>
                                {language === 'gujarati' ? 'હજુ સુધી કોઈ નિદાન નથી' : 'No diagnoses yet'}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[var(--space-4)] sm:gap-[var(--space-6)]">
                                {history.map(entry => (
                                    <button
                                        key={entry.id}
                                        onClick={() => restoreFromHistory(entry)}
                                        className="flex flex-col p-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--ui-border)] bg-[var(--ui-surface)] hover:border-[var(--ui-accent)] hover:shadow-md transition-all text-left w-full group"
                                    >
                                        <div className="w-full aspect-square rounded-[var(--radius-sm)] overflow-hidden bg-[var(--ui-surface-muted)] border border-[var(--ui-border)] mb-[var(--space-5)] relative group-hover:border-[var(--ui-accent)] transition-colors">
                                            <Image src={entry.thumbnail} alt={entry.disease} fill unoptimized className="object-cover" />
                                        </div>
                                        <div className="w-full px-[var(--space-1)] flex flex-col flex-1">
                                            <div className="flex items-start justify-between gap-[var(--space-3)] mb-[var(--space-2)]">
                                                <h3 className="text-[16px] font-semibold text-[var(--ui-text)] leading-snug line-clamp-2">{entry.disease}</h3>
                                                <span className="text-[11px] font-medium text-[var(--ui-text-muted)] bg-[var(--ui-surface-muted)] px-2 py-0.5 rounded-md border border-[var(--ui-border)] shrink-0 mt-0.5">
                                                    {entry.confidence}%
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-[var(--ui-text-muted)] truncate mb-[var(--space-4)]">{entry.plantName}</p>
                                            <p className="text-[12px] text-[var(--ui-text-muted)] mt-auto">{new Date(entry.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        );
    }

    if (isAnalyzing && !result) {
        return (
            <div className="w-full mx-auto p-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)]">
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-[var(--space-4)]">
                    <RefreshIcon size={32} className="animate-spin text-[var(--ui-accent)]" />
                    <p className="text-[var(--text-lg)] font-medium text-[var(--ui-text)]">
                        {language === 'gujarati' ? 'વિશ્લેષણ કરી રહ્યું છે...' : 'Analyzing plant health...'}
                    </p>
                </div>
            </div>
        );
    }

    if (image && result) {
        return (
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full mx-auto p-[var(--space-4)] md:px-[var(--space-8)] lg:px-[var(--space-12)] pb-[var(--space-16)]"
            >
                <div className="mb-[var(--space-6)]">
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-[var(--space-2)] text-[var(--text-sm)] font-medium text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] transition-colors group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">
                            <ArrowLeftIcon size={16} />
                        </span> 
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-[var(--space-6)] lg:gap-[var(--space-8)] items-start">
                    
                    {/* ── Left Sidebar (Sticky) ── */}
                    <div className="flex flex-col gap-[var(--space-4)] col-span-1 border border-[var(--ui-border)] p-[var(--space-4)] rounded-[var(--radius-lg)] bg-[var(--ui-surface)] lg:sticky lg:top-[var(--space-6)] h-fit self-start">
                        
                        <div className="relative w-full aspect-video md:aspect-square border border-[var(--ui-border)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--ui-surface-muted)] flex items-center justify-center">
                            <Image src={image} alt="Analyzed Specimen" fill sizes="(max-width: 1024px) 100vw, 420px" unoptimized className="object-cover" />
                        </div>

                        <div className="flex flex-col gap-[var(--space-3)] pt-[var(--space-2)]">
                            <div className="flex items-center justify-between gap-[var(--space-3)] pb-[var(--space-2)] border-b border-[var(--ui-border)]">
                                <label className="flex items-center gap-[var(--space-2)] text-[var(--text-sm)] text-[var(--ui-text-muted)] shrink-0">
                                    <GlobeIcon size={16} /> 
                                    {t('reportLanguage', language)}
                                </label>
                                <select 
                                    value={pdfLanguage} 
                                    onChange={(e) => setPdfLanguage(e.target.value)}
                                    className="px-[var(--space-2)] py-[var(--space-1)] border border-[var(--ui-border)] rounded-[var(--radius-sm)] bg-[var(--ui-surface)] text-[var(--ui-text)] text-[var(--text-sm)] min-w-[100px]"
                                >
                                    <option value="english">English</option>
                                    <option value="gujarati">ગુજરાતી</option>
                                </select>
                            </div>
                            
                            <button 
                                onClick={() => handleDownload(pdfLanguage)} 
                                disabled={isDownloading}
                                className="w-full flex items-center justify-center py-[var(--space-3)] px-[var(--space-4)] border border-[var(--ui-border)] rounded-[var(--radius-md)] bg-[var(--ui-surface)] hover:bg-[var(--ui-surface-hover)] transition-colors shadow-sm disabled:opacity-70 group"
                            >
                                <div className="flex flex-row items-center justify-center gap-[var(--space-2)] text-[var(--text-sm)] font-medium text-[var(--ui-text)]">
                                    {isDownloading ? (
                                        <>
                                            <div className="flex items-center justify-center h-4 w-4 shrink-0">
                                                <RefreshIcon size={16} className="animate-spin" />
                                            </div>
                                            <span className="whitespace-nowrap leading-none mt-0.5">{language === 'gujarati' ? 'તૈયાર કરી રહ્યા છીએ...' : 'Generating...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-center h-4 w-4 shrink-0">
                                                <DownloadIcon size={16} />
                                            </div>
                                            <span className="whitespace-nowrap leading-none mt-0.5">{language === 'gujarati' ? 'રિપોર્ટ ડાઉનલોડ કરો' : 'Download report'}</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* ── Right Panel: Full Analysis Stream ── */}
                    <div className="flex text-left flex-col col-span-1 gap-[var(--space-6)]">
                        
                        {/* AI Insights Block */}
                        <div className="border border-[var(--ui-border)] p-[var(--space-6)] md:p-[var(--space-8)] rounded-[var(--radius-lg)] bg-[var(--ui-surface)] w-full">
                            <div className="flex justify-between items-center mb-[var(--space-6)] pb-[var(--space-4)] border-b border-[var(--ui-border)]">
                                <h2 className="text-[var(--text-xl)] font-medium text-[var(--ui-text)] m-0">
                                    {language === 'gujarati' ? 'AI આંતરદૃષ્ટિ' : 'AI insights'}
                                </h2>
                            <span 
                                className="px-[var(--space-3)] py-[var(--space-1)] rounded-full text-[var(--text-xs)] font-bold uppercase text-white" 
                                style={{ backgroundColor: getSeverityColor(result.severity) }}
                            >
                                {t(result.severity.toLowerCase(), language)}
                            </span>
                        </div>

                        {result.is_mock && (
                            <div className="flex items-center gap-[var(--space-2)] p-[var(--space-3)] mb-[var(--space-4)] bg-[var(--color-warning)] bg-opacity-10 text-[#664d03] text-[var(--text-sm)] font-medium rounded-[var(--radius-sm)]">
                                <WarningIcon size={16} />
                                {t('demoMode', language)}
                            </div>
                        )}

                        <div className="flex flex-col gap-[var(--space-5)]">
                            <div>
                                <h3 className="text-[var(--text-2xl)] font-bold mb-[var(--space-2)] text-[var(--ui-text)]">
                                    {language === 'gujarati' && (result as any).disease_gujarati ? (result as any).disease_gujarati : result.disease}
                                </h3>
                                
                                {result.plant_name && (
                                    <p className="text-[var(--text-sm)] text-[var(--ui-text-muted)]">
                                        {t('identifiedAs', language)}: <span className="font-semibold text-[var(--ui-text)]">{language === 'gujarati' && (result as any).plant_name_gujarati ? (result as any).plant_name_gujarati : result.plant_name}</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="h-1 bg-[var(--ui-surface-muted)] rounded-full overflow-hidden mb-[var(--space-2)] border border-[var(--ui-border)]">
                                    <motion.div
                                        className="h-full bg-[var(--ui-text)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${result.confidence}%` }}
                                        transition={{ duration: 1, ease: 'circOut' }}
                                    />
                                </div>
                                <div className="flex justify-between text-[var(--text-xs)] text-[var(--ui-text-muted)]">
                                    <span>{t('aiConfidence', language)}</span>
                                    <span>{result.confidence}% {t('match', language)}</span>
                                </div>
                            </div>

                            <p className="text-[var(--text-base)] leading-relaxed text-[var(--ui-text)]">
                                {language === 'gujarati' && (result as any).description_gujarati ? (result as any).description_gujarati : result.description}
                            </p>

                            {result.seasonal_tips && (
                                <div className="p-[var(--space-4)] bg-[var(--ui-surface-muted)] border-l-4 border-[var(--ui-text)] rounded-r-[var(--radius-md)] mt-[var(--space-2)]">
                                    <h4 className="text-[var(--text-xs)] uppercase font-semibold text-[var(--ui-text-muted)] mb-[var(--space-2)]">
                                        {t('seasonalCareTip', language)}
                                    </h4>
                                    <p className="text-[var(--text-sm)] italic text-[var(--ui-text)] m-0">
                                        &ldquo;{language === 'gujarati' && (result as any).seasonal_tips_gujarati ? (result as any).seasonal_tips_gujarati : result.seasonal_tips}&rdquo;
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                        {/* Treatment Plan & Care Guide Block */}
                        <div className="border border-[var(--ui-border)] p-[var(--space-6)] md:p-[var(--space-8)] rounded-[var(--radius-lg)] bg-[var(--ui-surface)] w-full">
                            <div className="flex flex-col gap-[var(--space-8)]">
                                <TreatmentPlan remedies={result.remedies} language={language} />
                                
                                {result.prescribed_care && (
                                    <DetailedCareGuide prescribedCare={result.prescribed_care} language={language} />
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </motion.section>
        );
    }

    return null;
}

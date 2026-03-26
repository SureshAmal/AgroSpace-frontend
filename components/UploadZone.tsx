'use client';

import { useRef, useState } from 'react';
import { t } from '../lib/translations';
import { LeafIcon } from './Icons';
import { useLanguage } from '../app/providers';

interface UploadZoneProps {
    onImageSelected: (img: string) => void;
    className?: string;
}

export default function UploadZone({ onImageSelected, className = '' }: UploadZoneProps) {
    const { language } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                onImageSelected(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div
            className={`w-full aspect-square border-2 border-dashed rounded-[var(--radius-lg)] flex flex-col items-center justify-center gap-[var(--space-4)] bg-[var(--ui-surface)] cursor-pointer transition-all text-center p-[var(--space-6)] ${isDragOver ? 'border-[var(--ui-accent)] bg-[var(--ui-surface-hover)]' : 'border-[var(--ui-border)] hover:border-[var(--ui-accent)] hover:bg-[var(--ui-surface-hover)]'} ${className}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
        >
            <LeafIcon size={32} color="var(--ui-accent)" />
            <span className="font-semibold text-[var(--ui-text)]">
                {language === 'gujarati' ? 'ચિત્ર અપલોડ કરો' : 'Upload Image'}
            </span>
            <span className="text-[var(--text-sm)] text-[var(--ui-text-muted)]">
                {t('dragDropImage', language)}
            </span>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files?.[0]) processFile(e.target.files[0]);
                }}
                hidden
            />
        </div>
    );
}

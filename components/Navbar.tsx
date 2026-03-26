'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { useLanguage, useTheme } from '../app/providers';
import { t } from '../lib/translations';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const showLightIcon = isHydrated ? theme !== 'light' : false;
  
  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
      {showLightIcon ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  if (pathname === '/') {
    // Top-right nav overlay for landing page
    return (
      <div className="landing-nav">
        <div className="language-toggle">
          <button 
            className={`lang-btn ${language === 'english' ? 'active' : ''}`}
            onClick={() => setLanguage('english')}
          >
            eng
          </button>
          <button 
            className={`lang-btn ${language === 'gujarati' ? 'active' : ''}`}
            onClick={() => setLanguage('gujarati')}
          >
            ગુજ
          </button>
        </div>
        <ThemeToggle />
      </div>
    );
  }

  return (
    <nav className="app-toolbar">
      <div className="toolbar-left">
        <Link href="/" className="app-brand">
          {t('plantHealthAI', language)}
        </Link>
        <div className="app-nav-links">
          <Link href="/diagnosis" className={`nav-link ${pathname === '/diagnosis' ? 'active' : ''}`}>
            {t('diagnosis', language)}
          </Link>
          <Link href="/care" className={`nav-link ${pathname === '/care' ? 'active' : ''}`}>
            {t('care', language)}
          </Link>
          <Link href="/seasonal" className={`nav-link ${pathname === '/seasonal' ? 'active' : ''}`}>
            {t('seasonal', language)}
          </Link>
          <Link href="/environment" className={`nav-link ${pathname === '/environment' ? 'active' : ''}`}>
            {t('environment', language)}
          </Link>
        </div>
      </div>
      
      <div className="toolbar-right">
        <div className="language-toggle">
          <button 
            className={`lang-btn ${language === 'english' ? 'active' : ''}`}
            onClick={() => setLanguage('english')}
          >
            eng
          </button>
          <button 
            className={`lang-btn ${language === 'gujarati' ? 'active' : ''}`}
            onClick={() => setLanguage('gujarati')}
          >
            ગુજ
          </button>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}

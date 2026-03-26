'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content?: string;
  items?: string[];
  schedule?: { week: string; actions: string[] }[];
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string;
}

function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

function ItemIcon({ id }: { id: string }) {
  const icons: Record<string, ReactNode> = {
    overview: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
    immediate: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    schedule: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    environment: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    prevention: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  };
  return icons[id] || icons.overview;
}

export function Accordion({ items, defaultOpen }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="border border-[var(--ui-border)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--ui-surface)]"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full block hover:bg-[var(--ui-surface-hover)] transition-colors text-left focus:outline-none"
            >
              <div className="flex w-full flex-row items-center justify-between px-[var(--space-4)] py-[var(--space-4)]">
                <div className="flex flex-row items-center gap-[var(--space-3)]">
                  <span className="text-[var(--ui-text-muted)] shrink-0 flex items-center justify-center">
                    <ItemIcon id={item.id} />
                  </span>
                  <span className="text-[16px] font-medium text-[var(--ui-text)]">
                    {item.title}
                  </span>
                </div>
                <span className="text-[var(--ui-text-muted)] shrink-0 flex items-center justify-center ml-[var(--space-4)]">
                  <AccordionIcon isOpen={isOpen} />
                </span>
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-[var(--space-5)] pb-[var(--space-5)] text-[var(--ui-text-muted)] text-[var(--text-sm)]">
                    {item.content && (
                      <p className="mb-[var(--space-3)] leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    )}

                    {item.items && item.items.length > 0 && (
                      <ul className="flex flex-col gap-[var(--space-3)] mt-[var(--space-2)]">
                        {item.items.map((subItem, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            className="flex items-start gap-[var(--space-3)]"
                          >
                            <span className="text-[var(--ui-accent)] mt-[0.3em] shrink-0 opacity-70 text-[10px]">
                              •
                            </span>
                            <span className="flex-1 leading-relaxed">{subItem}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}

                    {item.schedule && item.schedule.length > 0 && (
                      <div className="flex flex-col gap-[var(--space-3)] mt-[var(--space-3)]">
                        {item.schedule.map((sched, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            className="bg-[var(--ui-surface-muted)] p-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--ui-border)]"
                          >
                            <h5 className="font-semibold text-[var(--ui-text)] mb-[var(--space-2)] text-[var(--text-sm)]">
                              {sched.week}
                            </h5>
                            <ul className="flex flex-col gap-[var(--space-2)]">
                              {sched.actions.map((action, actionIdx) => (
                                <li key={actionIdx} className="flex items-start gap-[var(--space-2)]">
                                  <span className="text-[var(--ui-accent)] mt-[0.3em] shrink-0 opacity-70 text-[10px]">
                                    •
                                  </span>
                                  <span className="flex-1 leading-relaxed">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
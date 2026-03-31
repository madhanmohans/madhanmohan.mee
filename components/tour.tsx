'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TourStep {
  id: string;
  title: string;
  body: string;
  /**
   * CSS selector for the element to highlight.
   * If omitted, or if placement === 'center', the tooltip is centered.
   */
  selector?: string;
  placement?: 'bottom' | 'top' | 'center';
}

interface TourProps {
  id: string;
  steps: TourStep[];
}

interface TooltipPos {
  top: number;
  left: number;
  arrowLeft?: number;
}

function storageKey(id: string) {
  return `site-tour-${id}-done`;
}

export function Tour({ id, steps }: TourProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem(storageKey(id))) {
      setVisible(true);
    }
  }, [id]);

  const dismiss = useCallback(() => {
    document.querySelectorAll('[data-tour-active]').forEach((el) => {
      el.removeAttribute('data-tour-active');
    });
    setVisible(false);
    localStorage.setItem(storageKey(id), '1');
  }, [id]);

  const next = useCallback(() => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  }, [step, steps.length, dismiss]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  // Keyboard navigation
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, next, prev, dismiss]);

  // Highlight the active target element
  useEffect(() => {
    if (!visible) return;
    const current = steps[step];
    const prevStep = steps[step - 1];

    if (prevStep?.selector) {
      document.querySelector(prevStep.selector)?.removeAttribute('data-tour-active');
    }
    if (current.selector && current.placement !== 'center') {
      document.querySelector(current.selector)?.setAttribute('data-tour-active', 'true');
    }

    return () => {
      if (current.selector) {
        document.querySelector(current.selector)?.removeAttribute('data-tour-active');
      }
    };
  }, [step, visible, steps]);

  // Compute tooltip position from target element
  useEffect(() => {
    if (!visible) return;
    const current = steps[step];

    if (!current.selector || current.placement === 'center') {
      setPos(null);
      return;
    }

    const el = document.querySelector(current.selector) as HTMLElement | null;
    if (!el) { setPos(null); return; }

    const rect = el.getBoundingClientRect();
    const cardWidth = 280;
    const gap = 14;

    const targetCx = rect.left + rect.width / 2;
    const rawLeft = targetCx - cardWidth / 2;
    const left = Math.max(12, Math.min(rawLeft, window.innerWidth - cardWidth - 12));
    const arrowLeft = Math.max(12, targetCx - left - 6);

    const top =
      (current.placement ?? 'bottom') === 'bottom'
        ? rect.bottom + gap
        : rect.top - gap;

    setPos({ top, left, arrowLeft });
  }, [step, visible, steps]);

  const current = steps[step];
  const isCenter = !current.selector || current.placement === 'center';
  const isLast = step === steps.length - 1;

  const cardStyle = isCenter
    ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300 }
    : pos
    ? { top: pos.top, left: pos.left, width: 280 }
    : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300 };

  return (
    <>
      <AnimatePresence>
        {visible && isCenter && (
          <motion.div
            key="tour-overlay"
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={`${id}-step-${step}`}
            ref={cardRef}
            className="fixed z-[61] tour-card"
            style={cardStyle}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.165, 0.84, 0.44, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {!isCenter && pos?.arrowLeft !== undefined && (
              <div className="tour-arrow" style={{ left: pos.arrowLeft }} />
            )}

            <div className="tour-counter">
              {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
            </div>

            <div className="tour-title">{current.title}</div>
            <p className="tour-body">{current.body}</p>

            <div className="tour-controls">
              <button className="tour-btn-ghost" onClick={dismiss}>
                skip
              </button>
              <div className="tour-nav">
                {step > 0 && (
                  <button className="tour-btn" onClick={prev}>←</button>
                )}
                <button className="tour-btn tour-btn-primary" onClick={next}>
                  {isLast ? 'done' : 'next →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

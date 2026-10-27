'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TourStep {
  id: string;
  title: string;
  body: string;
  selector?: string;
  placement?: 'bottom' | 'top' | 'center';
}

interface TourProps {
  id: string;
  steps: TourStep[];
}

interface TooltipPosition {
  top: number;
  left: number;
  arrowLeft?: number;
}

const TOOLTIP_CARD_WIDTH = 280;
const TOOLTIP_GAP = 14;
const TOOLTIP_MIN_MARGIN = 12;

function getTourStorageKey(tourId: string): string {
  return `site-tour-${tourId}-done`;
}

function isTourAlreadyCompleted(tourId: string): boolean {
  try {
    return !!localStorage.getItem(getTourStorageKey(tourId));
  } catch {
    return false;
  }
}

function markTourCompleted(tourId: string): void {
  try {
    localStorage.setItem(getTourStorageKey(tourId), '1');
  } catch {
    // Silently fail if localStorage is unavailable (e.g. private browsing)
  }
}

export function Tour({ id, steps }: TourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTourVisible, setIsTourVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);
  const tourCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTourAlreadyCompleted(id)) {
      setIsTourVisible(true);
    }
  }, [id]);

  const dismissTour = useCallback(() => {
    document.querySelectorAll('[data-tour-active]').forEach((element) => {
      element.removeAttribute('data-tour-active');
    });
    setIsTourVisible(false);
    markTourCompleted(id);
  }, [id]);

  const advanceStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((index) => index + 1);
    } else {
      dismissTour();
    }
  }, [currentStepIndex, steps.length, dismissTour]);

  const goBackStep = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((index) => index - 1);
  }, [currentStepIndex]);

  useEffect(() => {
    if (!isTourVisible) return;
    const keyboardEventHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissTour();
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        advanceStep();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goBackStep();
      }
    };
    window.addEventListener('keydown', keyboardEventHandler);
    return () => window.removeEventListener('keydown', keyboardEventHandler);
  }, [isTourVisible, advanceStep, goBackStep, dismissTour]);

  useEffect(() => {
    if (!isTourVisible) return;
    const currentStep = steps[currentStepIndex];
    const previousStep = steps[currentStepIndex - 1];

    if (previousStep?.selector) {
      document
        .querySelector(previousStep.selector)
        ?.removeAttribute('data-tour-active');
    }
    if (currentStep.selector && currentStep.placement !== 'center') {
      document
        .querySelector(currentStep.selector)
        ?.setAttribute('data-tour-active', 'true');
    }

    return () => {
      if (currentStep.selector) {
        document
          .querySelector(currentStep.selector)
          ?.removeAttribute('data-tour-active');
      }
    };
  }, [currentStepIndex, isTourVisible, steps]);

  useEffect(() => {
    if (!isTourVisible) return;
    const currentStep = steps[currentStepIndex];

    if (!currentStep.selector || currentStep.placement === 'center') {
      setTooltipPosition(null);
      return;
    }

    const targetElement = document.querySelector(
      currentStep.selector,
    ) as HTMLElement | null;
    if (!targetElement) {
      setTooltipPosition(null);
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const unclampedLeft = targetCenterX - TOOLTIP_CARD_WIDTH / 2;
    const left = Math.max(
      TOOLTIP_MIN_MARGIN,
      Math.min(
        unclampedLeft,
        window.innerWidth - TOOLTIP_CARD_WIDTH - TOOLTIP_MIN_MARGIN,
      ),
    );
    const arrowOffsetLeft = Math.max(
      TOOLTIP_MIN_MARGIN,
      targetCenterX - left - 6,
    );

    const top =
      (currentStep.placement ?? 'bottom') === 'bottom'
        ? targetRect.bottom + TOOLTIP_GAP
        : targetRect.top - TOOLTIP_GAP;

    setTooltipPosition({ top, left, arrowLeft: arrowOffsetLeft });
  }, [currentStepIndex, isTourVisible, steps]);

  const currentStep = steps[currentStepIndex];
  const isCenteredPlacement =
    !currentStep.selector || currentStep.placement === 'center';
  const isLastStep = currentStepIndex === steps.length - 1;

  const positionedCardStyle = isCenteredPlacement
    ? {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
      }
    : tooltipPosition
      ? {
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: TOOLTIP_CARD_WIDTH,
        }
      : {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
        };

  return (
    <>
      <AnimatePresence>
        {isTourVisible && isCenteredPlacement && (
          <motion.div
            key="tour-overlay"
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismissTour}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isTourVisible && (
          <motion.div
            key={`${id}-step-${currentStepIndex}`}
            ref={tourCardRef}
            className="fixed z-[61] tour-card"
            style={positionedCardStyle}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.165, 0.84, 0.44, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            {!isCenteredPlacement &&
              tooltipPosition?.arrowLeft !== undefined && (
                <div
                  className="tour-arrow"
                  style={{ left: tooltipPosition.arrowLeft }}
                />
              )}

            <div className="tour-counter">
              {String(currentStepIndex + 1).padStart(2, '0')} /{' '}
              {String(steps.length).padStart(2, '0')}
            </div>

            <div className="tour-title">{currentStep.title}</div>
            <p className="tour-body">{currentStep.body}</p>

            <div className="tour-controls">
              <button className="tour-btn-ghost" onClick={dismissTour}>
                skip
              </button>
              <div className="tour-nav">
                {currentStepIndex > 0 && (
                  <button className="tour-btn" onClick={goBackStep}>
                    ←
                  </button>
                )}
                <button
                  className="tour-btn tour-btn-primary"
                  onClick={advanceStep}
                >
                  {isLastStep ? 'done' : 'next →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

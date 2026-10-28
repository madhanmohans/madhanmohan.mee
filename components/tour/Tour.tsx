'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence, type Variants } from 'framer-motion';
import { InertWhileExiting } from '@/components/motion/InertWhileExiting';
import { TourCardContent } from './TourCardContent';
import {
  CENTERED_CARD_STYLE,
  TOOLTIP_CARD_WIDTH,
  computeTooltipPosition,
  isCenteredStep,
} from './tourPosition';
import { isTourAlreadyCompleted, markTourCompleted } from './tourStorage';
import type { TooltipPosition, TourStep } from './types';

export type { TourStep } from './types';

interface TourProps {
  id: string;
  steps: TourStep[];
}

// Halved durations: mode="wait" plays the exit and entrance back to back.
// `instant` (keyboard navigation) skips the animation entirely.
const cardVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: (instant: boolean) => ({
    opacity: 1,
    y: 0,
    transition: instant
      ? { duration: 0 }
      : { duration: 0.12, ease: [0.165, 0.84, 0.44, 1] },
  }),
  exit: (instant: boolean) => ({
    opacity: 0,
    y: -6,
    transition: instant ? { duration: 0 } : { duration: 0.1, ease: 'easeIn' },
  }),
};

function setTargetHighlighted(selector: string | undefined, active: boolean) {
  if (!selector) return;
  const element = document.querySelector(selector);
  if (active) element?.setAttribute('data-tour-active', 'true');
  else element?.removeAttribute('data-tour-active');
}

// First-visit walkthrough that steps through highlighted page elements
export function Tour({ id, steps }: TourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const [isTourVisible, setIsTourVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);

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
        setIsKeyboardNavigation(true);
        advanceStep();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIsKeyboardNavigation(true);
        goBackStep();
      }
    };
    window.addEventListener('keydown', keyboardEventHandler);
    return () => window.removeEventListener('keydown', keyboardEventHandler);
  }, [isTourVisible, advanceStep, goBackStep, dismissTour]);

  // Highlight the current step's target element
  useEffect(() => {
    if (!isTourVisible) return;
    const currentStep = steps[currentStepIndex];
    const previousStep = steps[currentStepIndex - 1];

    setTargetHighlighted(previousStep?.selector, false);
    if (currentStep.placement !== 'center') {
      setTargetHighlighted(currentStep.selector, true);
    }

    return () => setTargetHighlighted(currentStep.selector, false);
  }, [currentStepIndex, isTourVisible, steps]);

  // Anchor the card to the current step's target element
  useEffect(() => {
    if (!isTourVisible) return;
    const currentStep = steps[currentStepIndex];

    const targetElement = isCenteredStep(currentStep)
      ? null
      : document.querySelector(currentStep.selector!);
    setTooltipPosition(
      targetElement
        ? computeTooltipPosition(
            targetElement.getBoundingClientRect(),
            currentStep.placement,
          )
        : null,
    );
  }, [currentStepIndex, isTourVisible, steps]);

  const currentStep = steps[currentStepIndex];
  const isCenteredPlacement = isCenteredStep(currentStep);
  const anchoredPosition = isCenteredPlacement ? null : tooltipPosition;

  const positionedCardStyle = anchoredPosition
    ? {
        top: anchoredPosition.top,
        left: anchoredPosition.left,
        width: TOOLTIP_CARD_WIDTH,
      }
    : CENTERED_CARD_STYLE;

  return (
    <>
      <AnimatePresence>
        {isTourVisible && isCenteredPlacement && (
          <m.div
            key="tour-overlay"
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismissTour}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={isKeyboardNavigation}>
        {isTourVisible && (
          <m.div
            key={`${id}-step-${currentStepIndex}`}
            className="fixed z-[61] tour-card"
            style={positionedCardStyle}
            custom={isKeyboardNavigation}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={() => setIsKeyboardNavigation(false)}
          >
            <InertWhileExiting>
              <TourCardContent
                step={currentStep}
                stepIndex={currentStepIndex}
                stepCount={steps.length}
                arrowLeft={anchoredPosition?.arrowLeft}
                onSkip={dismissTour}
                onBack={goBackStep}
                onNext={advanceStep}
              />
            </InertWhileExiting>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

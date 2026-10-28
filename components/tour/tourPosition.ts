import type { TooltipPosition, TourStep } from './types';

export const TOOLTIP_CARD_WIDTH = 280;
const TOOLTIP_GAP = 14;
const TOOLTIP_MIN_MARGIN = 12;

export const CENTERED_CARD_STYLE = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
};

export function isCenteredStep(step: TourStep): boolean {
  return !step.selector || step.placement === 'center';
}

// Places the card above or below its target, clamped inside the viewport,
// with the arrow pointing at the target's horizontal centre
export function computeTooltipPosition(
  targetRect: DOMRect,
  placement: TourStep['placement'] = 'bottom',
): TooltipPosition {
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const unclampedLeft = targetCenterX - TOOLTIP_CARD_WIDTH / 2;
  const left = Math.max(
    TOOLTIP_MIN_MARGIN,
    Math.min(
      unclampedLeft,
      window.innerWidth - TOOLTIP_CARD_WIDTH - TOOLTIP_MIN_MARGIN,
    ),
  );
  const arrowLeft = Math.max(TOOLTIP_MIN_MARGIN, targetCenterX - left - 6);

  const top =
    placement === 'bottom'
      ? targetRect.bottom + TOOLTIP_GAP
      : targetRect.top - TOOLTIP_GAP;

  return { top, left, arrowLeft };
}

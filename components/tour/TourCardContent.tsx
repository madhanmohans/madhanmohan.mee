import type { TourStep } from './types';

function padStepNumber(value: number) {
  return String(value).padStart(2, '0');
}

export function TourCardContent({
  step,
  stepIndex,
  stepCount,
  arrowLeft,
  onSkip,
  onBack,
  onNext,
}: {
  step: TourStep;
  stepIndex: number;
  stepCount: number;
  arrowLeft?: number;
  onSkip: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const isLastStep = stepIndex === stepCount - 1;

  return (
    <>
      {arrowLeft !== undefined && (
        <div className="tour-arrow" style={{ left: arrowLeft }} />
      )}

      <div className="tour-counter">
        {padStepNumber(stepIndex + 1)} / {padStepNumber(stepCount)}
      </div>

      <div className="tour-title">{step.title}</div>
      <p className="tour-body">{step.body}</p>

      <div className="tour-controls">
        <button className="tour-btn-ghost" onClick={onSkip}>
          skip
        </button>
        <div className="tour-nav">
          {stepIndex > 0 && (
            <button className="tour-btn" onClick={onBack}>
              ←
            </button>
          )}
          <button className="tour-btn tour-btn-primary" onClick={onNext}>
            {isLastStep ? 'done' : 'next →'}
          </button>
        </div>
      </div>
    </>
  );
}

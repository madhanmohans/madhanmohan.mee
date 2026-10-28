export interface TourStep {
  id: string;
  title: string;
  body: string;
  selector?: string;
  placement?: 'bottom' | 'top' | 'center';
}

export interface TooltipPosition {
  top: number;
  left: number;
  arrowLeft?: number;
}

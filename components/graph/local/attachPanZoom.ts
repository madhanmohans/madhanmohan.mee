import type { MutableRefObject } from 'react';
import { MAX_ZOOM, MIN_ZOOM } from '../constants';
import { zoomAroundPoint } from './canvasTransform';
import type { CanvasTransform } from './types';

const WHEEL_ZOOM_STEP = 1.08;

function clampZoom(scale: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}

function getTouchDistance(touch1: Touch, touch2: Touch) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Wires wheel zoom, mouse drag panning and touch pan / pinch-zoom onto the
// canvas. Mutates `transformRef` and calls `requestRedraw` after each change.
// Returns a cleanup function that removes every listener.
export function attachPanZoom(
  canvas: HTMLCanvasElement,
  transformRef: MutableRefObject<CanvasTransform>,
  requestRedraw: () => void,
  isOverNode: (screenX: number, screenY: number) => boolean,
) {
  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();

    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    const zoomFactor = event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
    const newScale = clampZoom(transformRef.current.scale * zoomFactor);

    transformRef.current = zoomAroundPoint(
      transformRef.current,
      newScale,
      mouseX,
      mouseY,
    );
    requestRedraw();
  }

  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panStartOffsetX = 0;
  let panStartOffsetY = 0;

  function handleMouseDown(event: MouseEvent) {
    const canvasRect = canvas.getBoundingClientRect();
    const screenX = event.clientX - canvasRect.left;
    const screenY = event.clientY - canvasRect.top;
    if (isOverNode(screenX, screenY)) return;

    isPanning = true;
    panStartX = event.clientX;
    panStartY = event.clientY;
    panStartOffsetX = transformRef.current.offsetX;
    panStartOffsetY = transformRef.current.offsetY;
    canvas.style.cursor = 'grabbing';
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isPanning) return;
    transformRef.current.offsetX = panStartOffsetX + event.clientX - panStartX;
    transformRef.current.offsetY = panStartOffsetY + event.clientY - panStartY;
    requestRedraw();
  }

  function handleMouseUp() {
    if (isPanning) {
      isPanning = false;
      canvas.style.cursor = 'grab';
    }
  }

  let lastPinchDistance = 0;
  let lastPinchMidX = 0;
  let lastPinchMidY = 0;
  let isTouchPanActive = false;
  let touchPanStartX = 0;
  let touchPanStartY = 0;
  let touchPanStartOffsetX = 0;
  let touchPanStartOffsetY = 0;

  function startTouchPan(touch: Touch) {
    isTouchPanActive = true;
    touchPanStartX = touch.clientX;
    touchPanStartY = touch.clientY;
    touchPanStartOffsetX = transformRef.current.offsetX;
    touchPanStartOffsetY = transformRef.current.offsetY;
  }

  function getPinchMidpoint(touches: Touch[]) {
    const canvasRect = canvas.getBoundingClientRect();
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2 - canvasRect.left,
      y: (touches[0].clientY + touches[1].clientY) / 2 - canvasRect.top,
    };
  }

  function handleTouchStart(event: TouchEvent) {
    event.preventDefault();
    const touches = Array.from(event.touches);

    if (touches.length === 2) {
      lastPinchDistance = getTouchDistance(touches[0], touches[1]);
      const midpoint = getPinchMidpoint(touches);
      lastPinchMidX = midpoint.x;
      lastPinchMidY = midpoint.y;
    } else if (touches.length === 1) {
      startTouchPan(touches[0]);
    }
  }

  function handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    const touches = Array.from(event.touches);

    if (touches.length === 2) {
      const distance = getTouchDistance(touches[0], touches[1]);
      const { x: midX, y: midY } = getPinchMidpoint(touches);

      const newScale = clampZoom(
        transformRef.current.scale * (distance / lastPinchDistance),
      );
      const zoomed = zoomAroundPoint(
        transformRef.current,
        newScale,
        midX,
        midY,
      );

      transformRef.current = {
        scale: zoomed.scale,
        offsetX: zoomed.offsetX + midX - lastPinchMidX,
        offsetY: zoomed.offsetY + midY - lastPinchMidY,
      };
      requestRedraw();

      lastPinchDistance = distance;
      lastPinchMidX = midX;
      lastPinchMidY = midY;
    } else if (touches.length === 1 && isTouchPanActive) {
      transformRef.current.offsetX =
        touchPanStartOffsetX + touches[0].clientX - touchPanStartX;
      transformRef.current.offsetY =
        touchPanStartOffsetY + touches[0].clientY - touchPanStartY;
      requestRedraw();
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    const touches = Array.from(event.touches);
    if (touches.length < 2) lastPinchDistance = 0;
    if (touches.length === 0) isTouchPanActive = false;
    // Lifting one finger of a pinch continues as a pan from where it is
    if (touches.length === 1) startTouchPan(touches[0]);
  }

  canvas.addEventListener('wheel', handleWheel, { passive: false });
  canvas.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd);

  return () => {
    canvas.removeEventListener('wheel', handleWheel);
    canvas.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
  };
}

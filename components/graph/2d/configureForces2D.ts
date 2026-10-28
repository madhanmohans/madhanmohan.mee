import {
  forceCollide,
  forceCenter,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
} from 'd3-force';
import { configureGraphForces } from '../graphUtils';
import type { ForceGraphInstance } from '../types';

export function configureForces2D(forceGraphInstance: ForceGraphInstance) {
  configureGraphForces(forceGraphInstance, {
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
    forceX,
    forceY,
  });
}

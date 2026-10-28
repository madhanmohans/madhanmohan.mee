import {
  forceCollide,
  forceCenter,
  forceLink,
  forceManyBody,
} from 'd3-force-3d';
import { configureGraphForces } from '../graphUtils';
import type { ForceGraphInstance } from '../types';

export function configureForces3D(forceGraphInstance: ForceGraphInstance) {
  configureGraphForces(forceGraphInstance, {
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
  });
}

import {
  forceCollide,
  forceCenter,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  forceZ,
} from 'd3-force-3d';
import { configureGraphForces } from '../graphUtils';
import { POSITION_STRENGTH } from '../constants';
import type { ForceGraphInstance } from '../types';

export function configureForces3D(forceGraphInstance: ForceGraphInstance) {
  configureGraphForces(forceGraphInstance, {
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
    forceX,
    forceY,
  });
  forceGraphInstance.d3Force('z', forceZ(0).strength(POSITION_STRENGTH));
}

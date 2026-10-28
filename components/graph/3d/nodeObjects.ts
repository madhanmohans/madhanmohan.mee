import * as THREE from 'three';
import { LABEL_FONT_SIZE_3D } from '../constants';
import { isNodeHighlighted } from '../graphUtils';

const ACTIVE_NODE_COLOR = 0xc0392b;
const FALLBACK_NODE_COLOR = 0x6b6b6b;
const MAX_LABEL_LENGTH = 24;

// Resolves a CSS color variable to a 0xRRGGBB number for three.js
export function parseColorNumber(
  style: CSSStyleDeclaration,
  name: string,
  fallback: string,
): number {
  const element = document.createElement('div');
  element.style.color = style.getPropertyValue(name).trim() || fallback;
  element.style.display = 'none';
  document.body.appendChild(element);
  const rgb = getComputedStyle(element).color;
  document.body.removeChild(element);
  const parsedColorNo = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return parsedColorNo
    ? (parseInt(parsedColorNo[1]) << 16) |
        (parseInt(parsedColorNo[2]) << 8) |
        parseInt(parsedColorNo[3])
    : FALLBACK_NODE_COLOR;
}

// Resolves a CSS color variable to an opaque rgb()/hex string
export function parseColorString(
  style: CSSStyleDeclaration,
  name: string,
  fallback: string,
): string {
  const raw = style.getPropertyValue(name).trim() || fallback;
  const hex = raw.match(/^#([A-Fa-f\d]{6})([A-Fa-f\d]{2})$/);
  if (hex) return '#' + hex[1];
  const parsedColorStr = raw.match(
    /^rgba?\(\s*([^,\s)]+)\s*[,/]\s*([^,\s)]+)\s*[,/]\s*([^,\s)]+)/,
  );
  return parsedColorStr
    ? `rgb(${parsedColorStr[1]}, ${parsedColorStr[2]}, ${parsedColorStr[3]})`
    : raw;
}

export function makeTextSprite(
  text: string,
  color: string,
  fontSize: number,
  opacity = 1,
) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const font = `${fontSize}px Arial, sans-serif`;
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = metrics.width;
  const padding = 12;
  const width = textWidth + padding * 2;
  const height = fontSize * 2.8;
  canvas.width = width;
  canvas.height = height;

  context.font = font;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    sizeAttenuation: true,
    opacity,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(width / 10, height / 10, 1);
  return sprite;
}

// Sphere plus floating label; dims everything outside the hovered
// node's neighbourhood
export function createNodeObject(
  node: any,
  hoveredNode: any,
  computedStyles: CSSStyleDeclaration,
) {
  const mutedForegroundColor = parseColorString(
    computedStyles,
    '--color-fd-muted-foreground',
    '#6b6b6b',
  );

  const isActive = isNodeHighlighted(node, hoveredNode);

  const color = isActive
    ? ACTIVE_NODE_COLOR
    : parseColorNumber(
        computedStyles,
        '--color-fd-muted-foreground',
        '#6b6b6b',
      );
  const sphereRadius = isActive ? 5 : 3;

  const group = new THREE.Group();

  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: isActive || !hoveredNode ? 1 : 0.3,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  group.add(sphere);

  let label = node.text;
  if (label.length > MAX_LABEL_LENGTH) {
    label = label.slice(0, MAX_LABEL_LENGTH - 2) + '…';
  }
  const labelOpacity = isActive || !hoveredNode ? 1 : 0.35;
  const labelSprite = makeTextSprite(
    label,
    mutedForegroundColor,
    LABEL_FONT_SIZE_3D,
    labelOpacity,
  );
  labelSprite.position.y = sphereRadius + 5;
  group.add(labelSprite);

  return group;
}

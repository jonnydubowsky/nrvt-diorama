import * as THREE from "three";
import type { Vec3 } from "./types";

export const BASE = {
  width: 10,
  length: 46,
  soilDepth: 1.7,
} as const;

/** North (Danbury) → south (Norwalk). X meanders; Y is the water surface. */
export const DEFAULT_RIVER_POINTS: Vec3[] = [
  [0.35, 0.055, 21.6],
  [-1.05, 0.055, 16.2],
  [0.85, 0.055, 11.0],
  [-0.55, 0.055, 5.6],
  [1.15, 0.055, 0.4],
  [-0.35, 0.055, -5.2],
  [0.75, 0.055, -10.8],
  [-0.65, 0.055, -16.0],
  [0.25, 0.055, -21.6],
];

export function riverPoints(meander = 1): THREE.Vector3[] {
  return DEFAULT_RIVER_POINTS.map(
    ([x, y, z]) => new THREE.Vector3(x * meander, y, z),
  );
}

export function getRiverCurve(meander = 1) {
  return new THREE.CatmullRomCurve3(riverPoints(meander), false, "catmullrom", 0.15);
}

/** Offset the river in the XZ plane so the trail stays on the east bank. */
export function getTrailCurve(meander = 1, offset = 2.15, samples = 80) {
  const river = getRiverCurve(meander);
  const points: THREE.Vector3[] = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = river.getPointAt(t);
    const tangent = river.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(up, tangent).normalize();
    points.push(
      new THREE.Vector3(p.x + side.x * offset, 0.07, p.z + side.z * offset),
    );
  }

  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.15);
}

export function sideAt(
  curve: THREE.Curve<THREE.Vector3>,
  t: number,
  amount: number,
) {
  const p = curve.getPointAt(THREE.MathUtils.clamp(t, 0, 1));
  const tangent = curve.getTangentAt(THREE.MathUtils.clamp(t, 0, 1));
  const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
  return new THREE.Vector3(p.x + side.x * amount, 0, p.z + side.z * amount);
}

export const TOWN_STATIONS = {
  danbury: 0.07,
  redding: 0.28,
  ridgefield: 0.48,
  wilton: 0.69,
  norwalk: 0.9,
} as const;

export function townPosition(
  station: keyof typeof TOWN_STATIONS,
  meander = 1,
  trailOffset = 2.15,
  bankOffset = 1.55,
): Vec3 {
  const trail = getTrailCurve(meander, trailOffset);
  const p = sideAt(trail, TOWN_STATIONS[station], bankOffset);
  return [p.x, 0, p.z];
}

export function headingOnCurve(curve: THREE.Curve<THREE.Vector3>, t: number) {
  const tangent = curve.getTangentAt(THREE.MathUtils.clamp(t, 0, 1));
  return Math.atan2(tangent.x, tangent.z);
}

export function minDistanceToCurve(
  x: number,
  z: number,
  curve: THREE.Curve<THREE.Vector3>,
  samples = 72,
) {
  let min = Infinity;
  for (let i = 0; i <= samples; i++) {
    const p = curve.getPointAt(i / samples);
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < min) min = d;
  }
  return min;
}

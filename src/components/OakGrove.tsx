import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BASE, getRiverCurve, getTrailCurve } from "../lib/curves";
import { useInstanceLayout } from "../lib/instances";
import { palette } from "../lib/palette";
import { mulberry32, randRange } from "../lib/rng";
import type { TransformProps } from "../lib/types";

export type OakGroveProps = TransformProps & {
  count?: number;
  seed?: number;
  canopyColor?: string;
  trunkColor?: string;
  meander?: number;
  trailOffset?: number;
};

function clearance(
  x: number,
  z: number,
  river: THREE.CatmullRomCurve3,
  trail: THREE.CatmullRomCurve3,
) {
  let min = Infinity;
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    const r = river.getPointAt(t);
    const p = trail.getPointAt(t);
    min = Math.min(min, Math.hypot(x - r.x, z - r.z), Math.hypot(x - p.x, z - p.z));
  }
  return min;
}

export function OakGrove({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  count = 26,
  seed = 44,
  canopyColor = palette.oak,
  trunkColor = "#5a3824",
  meander = 1,
  trailOffset = 2.15,
}: OakGroveProps) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);

  const { trunks, canopies } = useMemo(() => {
    const rng = mulberry32(seed);
    const river = getRiverCurve(meander);
    const trail = getTrailCurve(meander, trailOffset);
    const trunks: THREE.Matrix4[] = [];
    const canopies: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    let guard = 0;

    while (trunks.length < count && guard < count * 18) {
      guard += 1;
      const x = randRange(rng, -BASE.width * 0.4, BASE.width * 0.4);
      const z = randRange(rng, -BASE.length * 0.45, BASE.length * 0.45);
      if (clearance(x, z, river, trail) < 1.25) continue;

      const h = randRange(rng, 0.9, 1.4);
      dummy.position.set(x, h * 0.36, z);
      dummy.rotation.set(0, rng() * Math.PI, 0);
      dummy.scale.set(1.15, h, 1.15);
      dummy.updateMatrix();
      trunks.push(dummy.matrix.clone());

      dummy.position.set(x, h * 0.95, z);
      dummy.scale.set(randRange(rng, 1.05, 1.4), randRange(rng, 0.5, 0.7), randRange(rng, 1.05, 1.4));
      dummy.updateMatrix();
      canopies.push(dummy.matrix.clone());
    }

    return { trunks, canopies };
  }, [count, meander, seed, trailOffset]);

  useInstanceLayout(trunkRef, trunks);
  useInstanceLayout(canopyRef, canopies);
  const drawn = trunks.length;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <instancedMesh key={`t-${drawn}`} ref={trunkRef} args={[undefined, undefined, drawn]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 0.7, 6]} />
        <meshLambertMaterial color={trunkColor} flatShading />
      </instancedMesh>
      <instancedMesh key={`c-${drawn}`} ref={canopyRef} args={[undefined, undefined, drawn]} castShadow>
        <dodecahedronGeometry args={[0.62, 0]} />
        <meshLambertMaterial color={canopyColor} flatShading />
      </instancedMesh>
    </group>
  );
}

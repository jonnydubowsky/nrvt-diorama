import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BASE, getRiverCurve, getTrailCurve } from "../lib/curves";
import { useInstanceLayout } from "../lib/instances";
import { palette } from "../lib/palette";
import { mulberry32, randRange } from "../lib/rng";
import type { TransformProps } from "../lib/types";

export type BirchGroveProps = TransformProps & {
  count?: number;
  seed?: number;
  canopyColor?: string;
  trunkColor?: string;
  meander?: number;
  trailOffset?: number;
};

export function BirchGrove({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  count = 24,
  seed = 73,
  canopyColor = palette.birchLeaf,
  trunkColor = palette.birchTrunk,
  meander = 1,
  trailOffset = 2.15,
}: BirchGroveProps) {
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

    while (trunks.length < count && guard < count * 20) {
      guard += 1;
      const x = randRange(rng, -BASE.width * 0.4, BASE.width * 0.38);
      const z = randRange(rng, -BASE.length * 0.44, BASE.length * 0.44);
      let min = Infinity;
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const r = river.getPointAt(t);
        const p = trail.getPointAt(t);
        min = Math.min(min, Math.hypot(x - r.x, z - r.z), Math.hypot(x - p.x, z - p.z));
      }
      if (min < 1.05) continue;

      const h = randRange(rng, 1.0, 1.55);
      dummy.position.set(x, h * 0.42, z);
      dummy.rotation.set(0, rng() * Math.PI, 0.04 * (rng() - 0.5));
      dummy.scale.set(0.7, h, 0.7);
      dummy.updateMatrix();
      trunks.push(dummy.matrix.clone());

      dummy.position.set(x, h * 1.05, z);
      dummy.scale.set(randRange(rng, 0.55, 0.8), randRange(rng, 0.45, 0.65), randRange(rng, 0.55, 0.8));
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
        <cylinderGeometry args={[0.035, 0.05, 0.85, 5]} />
        <meshLambertMaterial color={trunkColor} flatShading />
      </instancedMesh>
      <instancedMesh key={`c-${drawn}`} ref={canopyRef} args={[undefined, undefined, drawn]} castShadow>
        <icosahedronGeometry args={[0.48, 0]} />
        <meshLambertMaterial color={canopyColor} flatShading />
      </instancedMesh>
    </group>
  );
}

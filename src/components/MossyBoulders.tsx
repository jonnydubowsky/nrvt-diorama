import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BASE, getRiverCurve, getTrailCurve } from "../lib/curves";
import { useInstanceLayout } from "../lib/instances";
import { palette } from "../lib/palette";
import { mulberry32, randRange } from "../lib/rng";
import type { TransformProps } from "../lib/types";

export type MossyBouldersProps = TransformProps & {
  count?: number;
  seed?: number;
  stoneColor?: string;
  mossColor?: string;
  meander?: number;
  trailOffset?: number;
};

export function MossyBoulders({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  count = 22,
  seed = 31,
  stoneColor = palette.boulderMoss,
  mossColor = palette.moss,
  meander = 1,
  trailOffset = 2.15,
}: MossyBouldersProps) {
  const stoneRef = useRef<THREE.InstancedMesh>(null);
  const mossRef = useRef<THREE.InstancedMesh>(null);

  const { stones, moss } = useMemo(() => {
    const rng = mulberry32(seed);
    const river = getRiverCurve(meander);
    const trail = getTrailCurve(meander, trailOffset);
    const stones: THREE.Matrix4[] = [];
    const moss: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    let guard = 0;

    while (stones.length < count && guard < count * 16) {
      guard += 1;
      const x = randRange(rng, -BASE.width * 0.38, BASE.width * 0.38);
      const z = randRange(rng, -BASE.length * 0.42, BASE.length * 0.42);
      let min = Infinity;
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const r = river.getPointAt(t);
        const p = trail.getPointAt(t);
        min = Math.min(min, Math.hypot(x - r.x, z - r.z), Math.hypot(x - p.x, z - p.z));
      }
      if (min < 0.7 || min > 2.8) continue;

      dummy.position.set(x, 0.12, z);
      dummy.rotation.set(rng() * 0.7, rng() * Math.PI, rng() * 0.5);
      const s = randRange(rng, 0.22, 0.4);
      dummy.scale.set(s, s * 0.7, s);
      dummy.updateMatrix();
      stones.push(dummy.matrix.clone());

      dummy.position.set(x, 0.2, z);
      dummy.scale.set(s * 0.7, s * 0.22, s * 0.7);
      dummy.updateMatrix();
      moss.push(dummy.matrix.clone());
    }

    return { stones, moss };
  }, [count, meander, seed, trailOffset]);

  useInstanceLayout(stoneRef, stones);
  useInstanceLayout(mossRef, moss);
  const drawn = stones.length;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <instancedMesh key={`s-${drawn}`} ref={stoneRef} args={[undefined, undefined, drawn]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshLambertMaterial color={stoneColor} flatShading />
      </instancedMesh>
      <instancedMesh key={`m-${drawn}`} ref={mossRef} args={[undefined, undefined, drawn]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={mossColor} flatShading />
      </instancedMesh>
    </group>
  );
}

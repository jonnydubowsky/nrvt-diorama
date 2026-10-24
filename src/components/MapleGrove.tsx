import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BASE, getRiverCurve, getTrailCurve, minDistanceToCurve } from "../lib/curves";
import { useInstanceLayout } from "../lib/instances";
import { palette } from "../lib/palette";
import { mulberry32, randRange } from "../lib/rng";
import type { TransformProps } from "../lib/types";

export type MapleGroveProps = TransformProps & {
  count?: number;
  seed?: number;
  canopyColor?: string;
  trunkColor?: string;
  meander?: number;
  trailOffset?: number;
};

export function MapleGrove({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  count = 36,
  seed = 17,
  canopyColor = palette.maple,
  trunkColor = palette.trunk,
  meander = 1,
  trailOffset = 2.15,
}: MapleGroveProps) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const topRef = useRef<THREE.InstancedMesh>(null);

  const { trunks, canopies, tops } = useMemo(() => {
    const rng = mulberry32(seed);
    const river = getRiverCurve(meander);
    const trail = getTrailCurve(meander, trailOffset);
    const trunks: THREE.Matrix4[] = [];
    const canopies: THREE.Matrix4[] = [];
    const tops: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    let guard = 0;

    while (trunks.length < count && guard < count * 18) {
      guard += 1;
      const x = randRange(rng, -BASE.width * 0.42, BASE.width * 0.42);
      const z = randRange(rng, -BASE.length * 0.46, BASE.length * 0.46);
      if (minDistanceToCurve(x, z, river) < 1.55) continue;
      if (minDistanceToCurve(x, z, trail) < 1.15) continue;

      const h = randRange(rng, 0.85, 1.35);
      dummy.position.set(x, h * 0.38, z);
      dummy.rotation.set(0, rng() * Math.PI, 0);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      trunks.push(dummy.matrix.clone());

      dummy.position.set(x, h * 0.82, z);
      dummy.scale.set(randRange(rng, 0.7, 1.05), randRange(rng, 0.55, 0.8), randRange(rng, 0.7, 1.05));
      dummy.updateMatrix();
      canopies.push(dummy.matrix.clone());

      dummy.position.set(x + randRange(rng, -0.08, 0.08), h * 1.12, z);
      dummy.scale.setScalar(randRange(rng, 0.38, 0.55));
      dummy.updateMatrix();
      tops.push(dummy.matrix.clone());
    }

    return { trunks, canopies, tops };
  }, [count, meander, seed, trailOffset]);

  useInstanceLayout(trunkRef, trunks);
  useInstanceLayout(canopyRef, canopies);
  useInstanceLayout(topRef, tops);

  const drawn = trunks.length;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <instancedMesh key={`t-${drawn}`} ref={trunkRef} args={[undefined, undefined, drawn]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.72, 5]} />
        <meshLambertMaterial color={trunkColor} flatShading />
      </instancedMesh>
      <instancedMesh key={`c-${drawn}`} ref={canopyRef} args={[undefined, undefined, drawn]} castShadow>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshLambertMaterial color={canopyColor} flatShading />
      </instancedMesh>
      <instancedMesh key={`p-${drawn}`} ref={topRef} args={[undefined, undefined, drawn]} castShadow>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshLambertMaterial color={palette.mapleAlt} flatShading />
      </instancedMesh>
    </group>
  );
}

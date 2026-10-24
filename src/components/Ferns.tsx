import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BASE, getRiverCurve, getTrailCurve, minDistanceToCurve } from "../lib/curves";
import { useInstanceLayout } from "../lib/instances";
import { mulberry32, randRange } from "../lib/rng";
import type { TransformProps } from "../lib/types";

export type FernsProps = TransformProps & {
  count?: number;
  seed?: number;
  frondColor?: string;
  meander?: number;
  trailOffset?: number;
};

export function Ferns({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  count = 70,
  seed = 58,
  frondColor = "#6f8f58",
  meander = 1,
  trailOffset = 2.15,
}: FernsProps) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const matrices = useMemo(() => {
    const rng = mulberry32(seed);
    const river = getRiverCurve(meander);
    const trail = getTrailCurve(meander, trailOffset);
    const matrices: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const blades = 5;
    let planted = 0;
    let guard = 0;

    while (planted < count && guard < count * 20) {
      guard += 1;
      const x = randRange(rng, -BASE.width * 0.4, BASE.width * 0.4);
      const z = randRange(rng, -BASE.length * 0.44, BASE.length * 0.44);
      const riverDist = minDistanceToCurve(x, z, river);
      const trailDist = minDistanceToCurve(x, z, trail);
      if (riverDist < 0.85 || trailDist < 0.4 || riverDist > 2.6) continue;

      for (let b = 0; b < blades; b++) {
        const yaw = (b / blades) * Math.PI * 2 + rng() * 0.2;
        dummy.position.set(x + Math.sin(yaw) * 0.05, 0.12, z + Math.cos(yaw) * 0.05);
        dummy.rotation.set(0.55, yaw, 0);
        dummy.scale.set(0.09, randRange(rng, 0.22, 0.34), 0.04);
        dummy.updateMatrix();
        matrices.push(dummy.matrix.clone());
      }
      planted += 1;
    }

    return matrices;
  }, [count, meander, seed, trailOffset]);

  useInstanceLayout(ref, matrices);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <instancedMesh key={matrices.length} ref={ref} args={[undefined, undefined, matrices.length]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshLambertMaterial color={frondColor} flatShading />
      </instancedMesh>
    </group>
  );
}

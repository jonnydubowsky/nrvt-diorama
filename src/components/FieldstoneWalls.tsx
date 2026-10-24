import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getTrailCurve } from "../lib/curves";
import { useInstanceLayout } from "../lib/instances";
import { mulberry32, randRange } from "../lib/rng";
import type { TransformProps } from "../lib/types";

export type FieldstoneWallsProps = TransformProps & {
  count?: number;
  seed?: number;
  stoneColor?: string;
  meander?: number;
  trailOffset?: number;
  segments?: number;
};

export function FieldstoneWalls({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  count = 86,
  seed = 9,
  stoneColor = "#b0aaa0",
  meander = 1,
  trailOffset = 2.15,
  segments = 3,
}: FieldstoneWallsProps) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const matrices = useMemo(() => {
    const rng = mulberry32(seed);
    const trail = getTrailCurve(meander, trailOffset);
    const matrices: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const stations = [0.16, 0.52, 0.78].slice(0, segments);

    for (const station of stations) {
      const stones = Math.floor(count / stations.length);
      for (let i = 0; i < stones; i++) {
        const t = THREE.MathUtils.clamp(station + (i / stones - 0.5) * 0.09, 0.02, 0.98);
        const p = trail.getPointAt(t);
        const tangent = trail.getTangentAt(t);
        const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const row = i % 2;
        dummy.position.set(
          p.x + side.x * (0.42 + row * 0.08),
          0.1 + row * 0.11 + rng() * 0.02,
          p.z + side.z * (0.42 + row * 0.08),
        );
        dummy.rotation.set(rng() * 0.3, Math.atan2(tangent.x, tangent.z), rng() * 0.2);
        dummy.scale.set(randRange(rng, 0.14, 0.22), randRange(rng, 0.08, 0.13), randRange(rng, 0.1, 0.16));
        dummy.updateMatrix();
        matrices.push(dummy.matrix.clone());
      }
    }
    return matrices;
  }, [count, meander, seed, segments, trailOffset]);

  useInstanceLayout(ref, matrices);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <instancedMesh key={matrices.length} ref={ref} args={[undefined, undefined, matrices.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={stoneColor} flatShading />
      </instancedMesh>
    </group>
  );
}

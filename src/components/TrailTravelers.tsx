import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getTrailCurve } from "../lib/curves";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";
import { Cyclist } from "./Cyclist";
import { Walker } from "./Walker";

export type TrailTravelersProps = TransformProps & {
  playing?: boolean;
  meander?: number;
  trailOffset?: number;
  cyclistSpeed?: number;
  walkerSpeed?: number;
};

function poseOnCurve(
  curve: THREE.CatmullRomCurve3,
  t: number,
  lateral: number,
  target: THREE.Object3D,
) {
  const u = ((t % 1) + 1) % 1;
  const p = curve.getPointAt(u);
  const tangent = curve.getTangentAt(u);
  const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
  target.position.set(p.x + side.x * lateral, 0.02, p.z + side.z * lateral);
  target.lookAt(p.x + tangent.x, 0.02, p.z + tangent.z);
}

export function TrailTravelers({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  playing = true,
  meander = 1,
  trailOffset = 2.15,
  cyclistSpeed = 0.035,
  walkerSpeed = 0.016,
}: TrailTravelersProps) {
  const curve = useMemo(() => getTrailCurve(meander, trailOffset), [meander, trailOffset]);
  const a = useRef<THREE.Group>(null);
  const b = useRef<THREE.Group>(null);
  const w = useRef<THREE.Group>(null);
  const clock = useRef(4);

  const place = (time: number) => {
    if (a.current) poseOnCurve(curve, time * cyclistSpeed + 0.12, 0.08, a.current);
    if (b.current) poseOnCurve(curve, time * cyclistSpeed * 0.9 + 0.58, -0.08, b.current);
    if (w.current) poseOnCurve(curve, time * walkerSpeed + 0.34, 0.02, w.current);
  };

  useLayoutEffect(() => {
    place(clock.current);
  }, [curve, cyclistSpeed, walkerSpeed]);

  useFrame((_, delta) => {
    if (!playing) return;
    clock.current += delta;
    place(clock.current);
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={a} scale={1.35}>
        <Cyclist jerseyColor={palette.jerseyTeal} playing={playing} />
      </group>
      <group ref={b} scale={1.35}>
        <Cyclist jerseyColor={palette.jerseyRust} playing={playing} />
      </group>
      <group ref={w} scale={1.4}>
        <Walker playing={playing} />
      </group>
    </group>
  );
}

import { useMemo } from "react";
import { getRiverCurve } from "../lib/curves";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";

export type RailroadProps = TransformProps & {
  meander?: number;
  station?: number;
  length?: number;
  tieCount?: number;
  railColor?: string;
  ballastColor?: string;
};

export function Railroad({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  meander = 1,
  station = 0.58,
  length = 9.2,
  tieCount = 22,
  railColor = palette.rail,
  ballastColor = palette.ballast,
}: RailroadProps) {
  const placement = useMemo(() => {
    const river = getRiverCurve(meander);
    const p = river.getPointAt(station);
    const tangent = river.getTangentAt(station);
    const heading = Math.atan2(tangent.x, tangent.z) + Math.PI / 2;
    return {
      position: position ?? ([p.x, 0, p.z] as [number, number, number]),
      heading,
      riverPoint: p,
    };
  }, [meander, position, station]);

  const ties = useMemo(() => {
    return Array.from({ length: tieCount }, (_, i) => {
      return -length / 2 + (i + 0.5) * (length / tieCount);
    });
  }, [length, tieCount]);

  return (
    <group
      position={placement.position}
      rotation={[rotation[0], rotation[1] + placement.heading, rotation[2]]}
      scale={scale}
    >
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[1.15, 0.22, length]} />
        <meshLambertMaterial color="#8a6a4e" flatShading />
      </mesh>
      <mesh position={[0, 0.26, 0]} receiveShadow>
        <boxGeometry args={[0.95, 0.08, length]} />
        <meshLambertMaterial color={ballastColor} flatShading />
      </mesh>

      {ties.map((z) => (
        <mesh key={z} position={[0, 0.32, z]}>
          <boxGeometry args={[0.82, 0.05, 0.12]} />
          <meshLambertMaterial color={palette.tie} flatShading />
        </mesh>
      ))}

      {[-0.16, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.37, 0]}>
          <boxGeometry args={[0.045, 0.04, length]} />
          <meshLambertMaterial color={railColor} flatShading />
        </mesh>
      ))}

      {[-0.9, -0.45, 0, 0.45, 0.9].map((z) => (
        <mesh key={`pier-${z}`} position={[0, -0.08, z]}>
          <boxGeometry args={[0.12, 0.55, 0.12]} />
          <meshLambertMaterial color={palette.steel} flatShading />
        </mesh>
      ))}
    </group>
  );
}

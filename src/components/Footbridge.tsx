import { useMemo } from "react";
import { getRiverCurve, sideAt } from "../lib/curves";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";

export type FootbridgeProps = TransformProps & {
  meander?: number;
  station?: number;
  span?: number;
  steelColor?: string;
  streamColor?: string;
};

export function Footbridge({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  meander = 1,
  station = 0.44,
  span = 2.4,
  steelColor = palette.steel,
  streamColor = palette.waterDeep,
}: FootbridgeProps) {
  const placement = useMemo(() => {
    const river = getRiverCurve(meander);
    const mouth = river.getPointAt(station);
    const side = sideAt(river, station, 1.35);
    const mid = position ?? ([side.x, 0, side.z] as [number, number, number]);
    const heading = Math.atan2(side.x - mouth.x, side.z - mouth.z);
    return { position: mid, heading, mouth };
  }, [meander, position, station]);

  return (
    <group
      position={placement.position}
      rotation={[rotation[0], rotation[1] + placement.heading, rotation[2]]}
      scale={scale}
    >
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[0.55, 0.05, span + 0.4]} />
        <meshLambertMaterial color={streamColor} flatShading />
      </mesh>
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[0.85, 0.04, span + 0.55]} />
        <meshLambertMaterial color="#6d5b48" flatShading />
      </mesh>

      <mesh position={[0, 0.28, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.05, span]} />
        <meshLambertMaterial color="#b7bec6" flatShading />
      </mesh>

      {[-0.32, 0.32].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.52, 0]}>
            <boxGeometry args={[0.045, 0.06, span]} />
            <meshLambertMaterial color={steelColor} flatShading />
          </mesh>
          <mesh position={[x, 0.4, 0]}>
            <boxGeometry args={[0.03, 0.22, span]} />
            <meshLambertMaterial color={steelColor} flatShading />
          </mesh>
          {[-span / 2, span / 2].map((z) => (
            <mesh key={z} position={[x, 0.18, z]} castShadow>
              <boxGeometry args={[0.07, 0.36, 0.07]} />
              <meshLambertMaterial color={steelColor} flatShading />
            </mesh>
          ))}
        </group>
      ))}

      {[-0.55, 0.55].map((z) => (
        <mesh key={z} position={[0, 0.42, z]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.72, 0.035, 0.035]} />
          <meshLambertMaterial color={steelColor} flatShading />
        </mesh>
      ))}
    </group>
  );
}

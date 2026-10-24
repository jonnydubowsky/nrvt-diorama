import { useMemo } from "react";
import { getTrailCurve } from "../lib/curves";
import { createRibbonGeometry } from "../lib/geometry";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";

export type TrailProps = TransformProps & {
  meander?: number;
  offset?: number;
  width?: number;
  stoneColor?: string;
  edgeColor?: string;
};

export function Trail({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  meander = 1,
  offset = 2.15,
  width = 0.62,
  stoneColor = palette.trail,
  edgeColor = palette.trailEdge,
}: TrailProps) {
  const curve = useMemo(() => getTrailCurve(meander, offset), [meander, offset]);
  const surface = useMemo(
    () => createRibbonGeometry(curve, width, 100),
    [curve, width],
  );
  const edge = useMemo(
    () => createRibbonGeometry(curve, width + 0.16, 80, -0.012),
    [curve, width],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={edge} receiveShadow>
        <meshLambertMaterial color={edgeColor} flatShading />
      </mesh>
      <mesh geometry={surface} receiveShadow>
        <meshLambertMaterial color={stoneColor} flatShading />
      </mesh>
    </group>
  );
}

import { townPosition } from "../lib/curves";
import { TownSegment, type TownSegmentProps } from "./TownSegment";

export type WiltonProps = TownSegmentProps;

export function Wilton({
  position = townPosition("wilton"),
  rotation = [0, -0.1, 0],
  scale = [1, 1, 1],
  name = "Wilton",
  subtitle = "rail crossing",
  seed = 52,
  buildingCount = 4,
  wallColor = "#f4efe6",
  roofColor = "#704c3a",
}: WiltonProps) {
  return (
    <TownSegment
      position={position}
      rotation={rotation}
      scale={scale}
      name={name}
      subtitle={subtitle}
      seed={seed}
      buildingCount={buildingCount}
      wallColor={wallColor}
      roofColor={roofColor}
    />
  );
}

import { townPosition } from "../lib/curves";
import { TownSegment, type TownSegmentProps } from "./TownSegment";

export type ReddingProps = TownSegmentProps;

export function Redding({
  position = townPosition("redding"),
  rotation = [0, -0.15, 0],
  scale = [1, 1, 1],
  name = "Redding",
  subtitle = "wetland reach",
  seed = 23,
  buildingCount = 3,
  wallColor = "#f3eee4",
  roofColor = "#7d5a3c",
}: ReddingProps) {
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

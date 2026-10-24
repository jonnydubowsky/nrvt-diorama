import { townPosition } from "../lib/curves";
import { TownSegment, type TownSegmentProps } from "./TownSegment";

export type DanburyProps = TownSegmentProps;

export function Danbury({
  position = townPosition("danbury"),
  rotation = [0, 0.2, 0],
  scale = [1, 1, 1],
  name = "Danbury",
  subtitle = "northern trailhead",
  seed = 11,
  buildingCount = 5,
  wallColor = "#f6f1e8",
  roofColor = "#6a4a3a",
}: DanburyProps) {
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

import { townPosition } from "../lib/curves";
import { TownSegment, type TownSegmentProps } from "./TownSegment";

export type NorwalkProps = TownSegmentProps;

export function Norwalk({
  position = townPosition("norwalk"),
  rotation = [0, 0.12, 0],
  scale = [1, 1, 1],
  name = "Norwalk",
  subtitle = "river mouth",
  seed = 68,
  buildingCount = 5,
  wallColor = "#f8f4ec",
  roofColor = "#5a4034",
}: NorwalkProps) {
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

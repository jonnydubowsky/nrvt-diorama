import { townPosition } from "../lib/curves";
import { TownSegment, type TownSegmentProps } from "./TownSegment";

export type RidgefieldProps = TownSegmentProps;

export function Ridgefield({
  position = townPosition("ridgefield"),
  rotation = [0, 0.05, 0],
  scale = [1, 1, 1],
  name = "Ridgefield",
  subtitle = "high ridge",
  seed = 37,
  buildingCount = 4,
  wallColor = "#f7f3ec",
  roofColor = "#5e4638",
}: RidgefieldProps) {
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

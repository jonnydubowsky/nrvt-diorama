import { ContactShadows } from "@react-three/drei";
import { palette } from "../lib/palette";
import type { TransformProps } from "../lib/types";

export type SceneLightingProps = TransformProps & {
  sunColor?: string;
  sunIntensity?: number;
  ambientIntensity?: number;
  fogNear?: number;
  fogFar?: number;
  shadows?: boolean;
};

export function SceneLighting({
  position = [-16, 14, -10],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  sunColor = "#ffc48a",
  sunIntensity = 1.55,
  ambientIntensity = 0.28,
  fogNear = 52,
  fogFar = 110,
  shadows = true,
}: SceneLightingProps) {
  return (
    <>
      <color attach="background" args={[palette.sky]} />
      <fog attach="fog" args={[palette.fog, fogNear, fogFar]} />
      <ambientLight intensity={ambientIntensity} color="#fff4e6" />
      <hemisphereLight args={["#ffe2c0", "#6d8a62", 0.55]} />
      <group position={position} rotation={rotation} scale={scale}>
        <directionalLight
          intensity={sunIntensity}
          color={sunColor}
          castShadow={shadows}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.00035}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={26}
          shadow-camera-bottom={-26}
          shadow-camera-near={1}
          shadow-camera-far={56}
        />
      </group>
      <ContactShadows
        position={[0, -1.82, 0]}
        opacity={0.28}
        scale={56}
        blur={2.4}
        far={6}
        color="#4a3c30"
      />
    </>
  );
}

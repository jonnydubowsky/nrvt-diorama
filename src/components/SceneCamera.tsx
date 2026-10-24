import { OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import type { TransformProps } from "../lib/types";

export type SceneCameraProps = TransformProps & {
  projection?: "perspective" | "orthographic";
  fov?: number;
  zoom?: number;
  target?: [number, number, number];
};

export function SceneCamera({
  position = [20, 14, 18],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  projection = "perspective",
  fov = 28,
  zoom = 22,
  target = [0, 0.2, 0],
}: SceneCameraProps) {
  return (
    <group rotation={rotation} scale={scale}>
      {projection === "orthographic" ? (
        <OrthographicCamera
          makeDefault
          position={position}
          zoom={zoom}
          near={-80}
          far={120}
        />
      ) : (
        <PerspectiveCamera
          makeDefault
          position={position}
          fov={fov}
          near={0.1}
          far={160}
        />
      )}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        target={target}
        maxPolarAngle={Math.PI / 1.72}
        minDistance={8}
        maxDistance={56}
      />
    </group>
  );
}

import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { getRiverCurve } from "../lib/curves";
import { createRibbonGeometry } from "../lib/geometry";
import { useInstanceLayout } from "../lib/instances";
import { palette } from "../lib/palette";
import { mulberry32, randRange } from "../lib/rng";
import type { TransformProps } from "../lib/types";

export type RiverProps = TransformProps & {
  meander?: number;
  width?: number;
  waterColor?: string;
  deepColor?: string;
  boulderColor?: string;
  boulderCount?: number;
  riffleCount?: number;
  seed?: number;
  children?: ReactNode;
};

export function River({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  meander = 1,
  width = 1.2,
  waterColor = palette.water,
  deepColor = palette.waterDeep,
  boulderColor = palette.boulder,
  boulderCount = 28,
  riffleCount = 6,
  seed = 21,
  children,
}: RiverProps) {
  const curve = useMemo(() => getRiverCurve(meander), [meander]);
  const water = useMemo(
    () => createRibbonGeometry(curve, width, 96),
    [curve, width],
  );
  const bed = useMemo(
    () => createRibbonGeometry(curve, width + 0.38, 80, -0.06),
    [curve, width],
  );
  const deep = useMemo(
    () => createRibbonGeometry(curve, width * 0.45, 72, -0.012),
    [curve, width],
  );

  const boulderRef = useRef<THREE.InstancedMesh>(null);
  const boulderMatrices = useMemo(() => {
    const rng = mulberry32(seed);
    const matrices: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boulderCount; i++) {
      const t = rng();
      const p = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const bank = (rng() < 0.5 ? -1 : 1) * (width * 0.42 + rng() * 0.22);
      dummy.position.set(p.x + side.x * bank, 0.07 + rng() * 0.04, p.z + side.z * bank);
      dummy.rotation.set(rng() * 0.8, rng() * Math.PI, rng() * 0.6);
      const s = randRange(rng, 0.12, 0.26);
      dummy.scale.set(s, s * randRange(rng, 0.7, 1.1), s);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }
    return matrices;
  }, [boulderCount, curve, seed, width]);
  useInstanceLayout(boulderRef, boulderMatrices);

  const riffles = useMemo(() => {
    const items: { position: [number, number, number]; rotation: number; scale: [number, number, number] }[] =
      [];
    for (let i = 0; i < riffleCount; i++) {
      const t = (i + 0.35) / (riffleCount + 0.4);
      const p = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      items.push({
        position: [p.x, p.y + 0.02, p.z],
        rotation: Math.atan2(tangent.x, tangent.z),
        scale: [width * 0.55, 0.03, 0.32],
      });
    }
    return items;
  }, [curve, riffleCount, width]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={bed} receiveShadow>
        <meshLambertMaterial color="#7a6a58" flatShading />
      </mesh>
      <mesh geometry={water} receiveShadow>
        <meshLambertMaterial color={waterColor} flatShading />
      </mesh>
      <mesh geometry={deep}>
        <meshLambertMaterial color={deepColor} flatShading />
      </mesh>
      {riffles.map((riffle, index) => (
        <mesh
          key={index}
          position={riffle.position}
          rotation={[-0.04, riffle.rotation, 0]}
          scale={riffle.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={palette.foam} flatShading />
        </mesh>
      ))}
      <instancedMesh
        key={boulderCount}
        ref={boulderRef}
        args={[undefined, undefined, boulderCount]}
        castShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshLambertMaterial color={boulderColor} flatShading />
      </instancedMesh>
      {children}
    </group>
  );
}

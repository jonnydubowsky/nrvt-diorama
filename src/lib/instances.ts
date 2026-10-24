import { useLayoutEffect, type RefObject } from "react";
import * as THREE from "three";

export function useInstanceLayout(
  ref: RefObject<THREE.InstancedMesh | null>,
  matrices: THREE.Matrix4[],
) {
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [matrices]);
}

export function composeMatrix(
  position: THREE.Vector3,
  rotation: THREE.Euler,
  scale: THREE.Vector3,
  target = new THREE.Matrix4(),
) {
  return target.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
}

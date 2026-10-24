import * as THREE from "three";

export function createRibbonGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  width: number,
  segments: number,
  yOffset = 0,
) {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(up, tangent);
    if (side.lengthSq() < 1e-8) side.set(1, 0, 0);
    else side.normalize();

    const left = p.clone().addScaledVector(side, width / 2);
    const right = p.clone().addScaledVector(side, -width / 2);
    positions.push(
      left.x,
      left.y + yOffset,
      left.z,
      right.x,
      right.y + yOffset,
      right.z,
    );
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(0, t, 1, t);

    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

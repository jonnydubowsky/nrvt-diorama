import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Diorama } from "./components/Diorama";

export default function App() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="app">
      <Canvas
        className="canvas"
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Diorama playing={playing} />
      </Canvas>

      <aside className="plaque">
        <p className="kicker">Fairfield County, Connecticut</p>
        <h1>Norwalk River Valley Trail</h1>
        <p className="lede">
          A low-poly slice of the greenway from Danbury south to the river mouth
          at Norwalk — crushed stone, wetland boardwalk, and a single rail
          crossing.
        </p>
        <button type="button" onClick={() => setPlaying((value) => !value)}>
          {playing ? "Pause travelers" : "Play travelers"}
        </button>
        <p className="hint">Drag to orbit · scroll to zoom</p>
      </aside>
    </div>
  );
}

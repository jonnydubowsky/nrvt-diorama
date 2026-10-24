import { type ReactNode } from "react";

export function GlobalProvider({ children }: { children?: ReactNode }) {
  return children;
}

export function CanvasProvider({
  children,
  fillLight = true,
  fillIntensity = 0.55,
}: {
  children?: ReactNode;
  fillLight?: boolean;
  fillIntensity?: number;
}) {
  return (
    <>
      {fillLight && (
        <>
          <ambientLight intensity={0.35} color="#fff4e6" />
          <hemisphereLight args={["#ffe2c0", "#6d8a62", fillIntensity]} />
        </>
      )}
      {children}
    </>
  );
}

export default function Provider({ children }: { children?: ReactNode }) {
  return children;
}

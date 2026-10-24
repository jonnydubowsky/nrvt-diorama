import { townPosition } from "../lib/curves";
import type { TransformProps } from "../lib/types";
import { BirchGrove } from "./BirchGrove";
import { Boardwalk } from "./Boardwalk";
import { Danbury } from "./Danbury";
import { DioramaBase } from "./DioramaBase";
import { Ferns } from "./Ferns";
import { FieldstoneWalls } from "./FieldstoneWalls";
import { Footbridge } from "./Footbridge";
import { MapleGrove } from "./MapleGrove";
import { MossyBoulders } from "./MossyBoulders";
import { Norwalk } from "./Norwalk";
import { OakGrove } from "./OakGrove";
import { Railroad } from "./Railroad";
import { Redding } from "./Redding";
import { Ridgefield } from "./Ridgefield";
import { River } from "./River";
import { SceneCamera } from "./SceneCamera";
import { SceneLighting } from "./SceneLighting";
import { Trail } from "./Trail";
import { TrailTravelers } from "./TrailTravelers";
import { Wilton } from "./Wilton";

export type DioramaProps = TransformProps & {
  playing?: boolean;
  meander?: number;
  trailOffset?: number;
  mapleCount?: number;
  oakCount?: number;
  birchCount?: number;
  projection?: "perspective" | "orthographic";
};

export function Diorama({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  playing = true,
  meander = 1,
  trailOffset = 2.15,
  mapleCount = 28,
  oakCount = 20,
  birchCount = 18,
  projection = "perspective",
}: DioramaProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <SceneLighting />
      <SceneCamera projection={projection} />
      <DioramaBase />
      <River meander={meander}>
        <Trail meander={meander} offset={trailOffset} />
        <TrailTravelers
          playing={playing}
          meander={meander}
          trailOffset={trailOffset}
        />
      </River>
      <Boardwalk meander={meander} trailOffset={trailOffset} />
      <Footbridge meander={meander} />
      <Railroad meander={meander} />
      <MapleGrove count={mapleCount} meander={meander} trailOffset={trailOffset} />
      <OakGrove count={oakCount} meander={meander} trailOffset={trailOffset} />
      <BirchGrove count={birchCount} meander={meander} trailOffset={trailOffset} />
      <FieldstoneWalls meander={meander} trailOffset={trailOffset} />
      <MossyBoulders meander={meander} trailOffset={trailOffset} />
      <Ferns meander={meander} trailOffset={trailOffset} />
      <Danbury position={townPosition("danbury", meander, trailOffset)} />
      <Redding position={townPosition("redding", meander, trailOffset)} />
      <Ridgefield position={townPosition("ridgefield", meander, trailOffset)} />
      <Wilton position={townPosition("wilton", meander, trailOffset)} />
      <Norwalk position={townPosition("norwalk", meander, trailOffset)} />
    </group>
  );
}

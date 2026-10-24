# Norwalk River Valley Trail

An interactive low-poly 3D diorama of the Norwalk River Valley Trail — the greenway along the Norwalk River in Fairfield County, Connecticut. Built with Vite, React, TypeScript, Three.js, React Three Fiber, and Drei, and set up so every scene piece can be opened and tuned in [Triplex](https://github.com/pmndrs/triplex).

The river is a single CatmullRom curve from Danbury (north) to Norwalk (south). The crushed-stone trail is that same curve offset to the east bank, so changing `meander` on `Diorama` keeps the water, path, towns, and travelers lined up.

## Run locally

```bash
npm install
npm run dev
```

The Vite server binds to `http://127.0.0.1:43180`. Drag to orbit, scroll to zoom, and use **Play travelers / Pause travelers** to freeze the two cyclists and the walker on the trail.

```bash
npm run build
npm run preview
```

## Open in Triplex

Configuration follows the current [Triplex config docs](https://triplex.dev/docs/api-reference/config-options) and the official empty / room examples in [pmndrs/triplex](https://github.com/pmndrs/triplex):

- [`.triplex/config.json`](.triplex/config.json) — `$schema`, `files`, `components`, and `provider`
- [`.triplex/provider.tsx`](.triplex/provider.tsx) — `GlobalProvider`, `CanvasProvider`, and a default export, as described in [Providers](https://triplex.dev/docs/building-your-scene/providers)

1. Install [Triplex for VS Code](https://marketplace.visualstudio.com/items?itemName=trytriplex.triplex-vsce) (also works in Cursor).
2. Open this folder as the workspace.
3. Open any file under `src/components/`. The **Open in Triplex** CodeLens appears above each exported component.
4. Click a mesh or use the scene panel. Typed props become inputs. `position`, `rotation`, and `scale` get transform controls.

Globs are relative to `.triplex/config.json`, matching the official templates:

```json
{
  "$schema": "https://triplex.dev/config.schema.json",
  "components": ["../src/components/*.tsx"],
  "files": ["../src/**/*.tsx"],
  "provider": "./provider.tsx"
}
```

- `files` — components that can be opened
- `components` — components that can be dragged into a scene
- Only **exported** functions are picked up
- Props need TypeScript types (and defaults) to show as controls

`CanvasProvider` adds a warm fill light so a piece opened on its own is not black. Open `Diorama` for the full valley with lighting and camera.

## Scene pieces and props

Every piece lives in `src/components/` and accepts `position`, `rotation`, and `scale` as `[x, y, z]`.

| Component | What it is | Extra props |
| --- | --- | --- |
| `Diorama` | Full valley | `playing`, `meander`, `trailOffset`, `mapleCount`, `oakCount`, `birchCount`, `projection` |
| `DioramaBase` | Long soil block with cut-away strata | `width`, `length`, `soilDepth`, `grassColor`, `showCutaway` |
| `River` | CatmullRom water, riffles, bank boulders | `meander`, `width`, `waterColor`, `deepColor`, `boulderColor`, `boulderCount`, `riffleCount`, `seed` |
| `Trail` | Pale crushed-stone path offset from the river | `meander`, `offset`, `width`, `stoneColor`, `edgeColor` |
| `Boardwalk` | Wood walk over a Redding wetland | `meander`, `trailOffset`, `station`, `length`, `plankCount`, `woodColor`, `wetlandColor` |
| `Footbridge` | Steel span over a side stream | `meander`, `station`, `span`, `steelColor`, `streamColor` |
| `Railroad` | Single track on an embankment / trestle | `meander`, `station`, `length`, `tieCount`, `railColor`, `ballastColor` |
| `MapleGrove` / `OakGrove` / `BirchGrove` | Instanced early-autumn trees | `count`, `seed`, `canopyColor`, `trunkColor`, `meander`, `trailOffset` |
| `FieldstoneWalls` | Dry-stone walls along the trail | `count`, `seed`, `stoneColor`, `segments`, `meander`, `trailOffset` |
| `MossyBoulders` | Scatter of moss-capped rocks | `count`, `seed`, `stoneColor`, `mossColor`, `meander`, `trailOffset` |
| `Ferns` | Instanced fronds | `count`, `seed`, `frondColor`, `meander`, `trailOffset` |
| `TownSegment` | White clapboard cluster + floating label | `name`, `subtitle`, `seed`, `buildingCount`, `wallColor`, `roofColor` |
| `Danbury` `Redding` `Ridgefield` `Wilton` `Norwalk` | Town wrappers, north → south | Same as `TownSegment` |
| `Cyclist` / `Walker` | Low-poly figures | `jerseyColor` / `coatColor`, `playing` |
| `TrailTravelers` | Two cyclists + one walker on the trail curve | `playing`, `meander`, `trailOffset`, `cyclistSpeed`, `walkerSpeed` |
| `SceneLighting` | Late-afternoon sun, fog, contact shadow | `sunColor`, `sunIntensity`, `ambientIntensity`, `fogNear`, `fogFar`, `shadows` |
| `SceneCamera` | Narrow-FOV perspective (default) or orthographic + orbit | `projection`, `fov`, `zoom`, `target` |

Vegetation uses a seeded PRNG (`mulberry32`) so counts and colors can change without the grove jumping around.

## Layout

Positive **Z** is north. The river runs the length of the block; the trail stays on the east bank. Towns sit further east of the path: Danbury, Redding, Ridgefield, Wilton, Norwalk.

The default camera is perspective at `fov` 38 so the whole valley and the HTML town labels stay readable. Set `projection` to `"orthographic"` on `Diorama` or `SceneCamera` for a flatter isometric view — use `zoom` around `1.4`, not a large number, or the frustum collapses to a sliver. HTML labels can scale poorly in ortho; switch back to perspective if names blow up.

## What was verified from the Triplex repo

Confirmed against the README, [config schema](https://triplex.dev/config.schema.json), docs, and in-repo examples (`examples/room`, `packages/create-triplex-project/templates/empty` and `point-and-click`):

- Config lives in `.triplex/config.json` with `$schema: https://triplex.dev/config.schema.json`
- `files` / `components` are globs **relative to the config file**
- Official empty template uses `"components": ["../src/components/*.tsx"]` and `"files": ["../src/**/*.tsx"]`
- `provider` points at a module next to the config
- Current provider docs export `GlobalProvider` and `CanvasProvider`; the schema text still mentions a default export, so this project ships both
- Exported components with typed props (and defaults) become editor controls

Not verified in this environment: actually launching the Triplex VS Code / Cursor webview. The editor is an IDE extension and is not installed on this machine.

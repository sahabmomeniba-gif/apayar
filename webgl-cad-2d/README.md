# WebGL CAD 2D

A clean, generic 2D CAD foundation rebuilt from the legacy `webCad` behavior model. React owns the application shell; CAD geometry and text quads are rendered by WebGL shaders (no SVG, OpenLayers, or visible Canvas 2D rendering).

## Run

```bash
npm install
npm run dev
```

Use **Import DXF** and select any ASCII DXF, or use the ribbon buttons to load the styled and clean bundled samples. The drawing is fitted automatically. Wheel zooms around the cursor; middle/right drag or the Pan tool pans. Select geometry to inspect its metadata. Toggle visibility and locking in Layers.

The repository keeps `apfloor0-sample.dxf` unchanged and provides `apfloor0-sample-clean.dxf` with annotation entities and entity-level custom style groups removed. Regenerate it reproducibly with `node scripts/create-clean-dxf.mjs <input> <output>`.

Keyboard: `S` select, `H` pan, `Z` zoom, `M` measure, `L` line, `P` polyline, `Enter`/`Space` confirm, `Esc` cancel, and `Delete` removes the selection. Shift-click adds/removes entities from a multi-selection. Space while Select is active repeats the last tool.

## Supported DXF

`LINE`, `LWPOLYLINE`, `POLYLINE`, `POINT`, `TEXT`, `MTEXT`, `CIRCLE`, `ARC`, `ELLIPSE`, `SPLINE`, `SOLID`, `3DFACE`, and `INSERT`. Inserts are expanded from parsed block definitions while remaining inspectable block-reference entities. Layers, indexed/true colors, line weights, line types, handles, and source metadata are preserved where the parser exposes them. Unsupported kinds are reported without failing the complete import. Native DXF `HATCH` is not exposed by the selected parser; solid faces are mapped to the internal hatch/fill entity.

## Architecture

- `cad/core`: `CadEngine` API, typed entities, layers, reusable styles, scene, selection, and camera transforms
- `cad/import`: parser-to-domain mapping independent of the UI
- `cad/render`: WebGL geometry pipeline and GPU-textured text quads
- `cad/snap`: endpoint, midpoint, vertex, nearest, and center candidates
- `cad/commands`: lifecycle commands receiving pointer and keyboard events independently from React
- `components`: React/Tailwind test shell, viewport, layers, and inspector

## Legacy migration notes

The old project was inspected before implementation. This version preserves its by-layer/by-entity style inheritance, dark `appStyle` palette, layer visibility/freeze and per-layer snapping model, entity metadata inspection, CAD keyboard confirmation/cancellation, command-tool workflow, bright construction previews, widened selected strokes, and reusable snap concepts. Style priority is state → entity → layer → named/default. It deliberately removes the old OpenLayers/DOM coupling.

## Current scope / TODO

This phase provides multi-selection, hover, delete, pan/zoom/fit/fit-selected/reset, measurement, line/polyline creation, endpoint/midpoint/vertex/nearest/center/intersection/perpendicular snapping, dashed strokes, simple polygon/solid fills, block references, and DXF import. Concave polygon tessellation, patterned native HATCH, bulge arcs, undo/redo, editing grips, binary DXF, and persistence remain future work. There is no apartment-specific logic.

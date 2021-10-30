import { ColorDef } from "../colors/color-def.ts";
import * as color from "../colors/color.ts";
import { TerrainDef } from "./terrain-def.ts";

export type TerrainIndex = number;

const registry: TerrainDef[] = [];

function register(
  fg: ColorDef,
  bg: ColorDef,
  ch: string,
  name: string,
): TerrainDef {
  const index = registry.length;
  const t = new TerrainDef(fg, bg, ch, name, index);
  registry.push(t);
  return t;
}

export function getTerrain(index: TerrainIndex): TerrainDef {
  return registry[index];
}

export const NETHER = register(color.BLACK, color.WHITE, "@", "NETHER");
export const WATER = register(color.BLACK, color.WATER, "☺", "WATER");
export const DIRT = register(color.BLACK, color.EARTH1, " ", "DIRT");
export const FOREST = register(color.FOREST_DARK, color.FOREST, "Δ", "FOREST");

import { ColorDef } from "../colors/color-def.ts";
import { TerrainIndex } from "./terrain.ts";

export class TerrainDef {
  readonly chBytes: Uint8Array;

  constructor(
    public readonly fg: ColorDef,
    public readonly bg: ColorDef,
    public readonly ch: string,
    public readonly name: string,
    public readonly index: TerrainIndex,
  ) {
    this.chBytes = new TextEncoder().encode(ch);
  }
}

import { TerrainDef } from "../terrain/terrain-def.ts";
import * as terrain from "../terrain/terrain.ts";

/**
 * True remainder after division (handles negatives correctly).
 * @param numerator
 * @param denominator
 * @returns The remainder after the division.
 */
function rem(numerator: number, denominator: number): number {
  if (numerator < 0.0) {
    return ((numerator % denominator) + denominator) % denominator;
  } else {
    return numerator % denominator;
  }
}

export class World {
  readonly world: Uint8Array;

  constructor(
    public readonly width: number,
    public readonly height: number,
    init?: TerrainDef,
  ) {
    this.world = new Uint8Array(width * height);
    if (init) {
      for (let i = 0; i < this.world.length; i++) {
        this.world[i] = init.index;
      }
    }
  }

  protected addr(x: number, y: number): number {
    const xc = rem(x, this.width);
    const yc = rem(y, this.height);

    return yc * this.width + xc;
  }

  public getLoc(x: number, y: number): TerrainDef {
    return terrain.getTerrain(this.world[this.addr(x, y)]);
  }

  public setLoc(x: number, y: number, terrain: TerrainDef): void {
    this.world[this.addr(x, y)] = terrain.index;
  }

  public neighbors(x: number, y: number): TerrainDef[] {
    const ns = [];
    ns.push(this.getLoc(x + 1, y));
    ns.push(this.getLoc(x + 1, y - 1));
    ns.push(this.getLoc(x, y - 1));
    ns.push(this.getLoc(x - 1, y - 1));
    ns.push(this.getLoc(x - 1, y));
    ns.push(this.getLoc(x - 1, y + 1));
    ns.push(this.getLoc(x, y + 1));
    ns.push(this.getLoc(x + 1, y + 1));
    return ns;
  }
}

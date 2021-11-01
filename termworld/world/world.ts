import { rem } from "../../util.ts";
import { TerrainDef } from "../terrain/terrain-def.ts";
import * as terrain from "../terrain/terrain.ts";
import { NETHER } from "../terrain/terrain.ts";

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

  public empty(): World {
    return new World(this.width, this.height, NETHER);
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

  public overlay(other: World): void {
    if (other.width !== this.width || other.height !== other.height) {
      throw new Error(
        `world mismatch; (${this.width}:${this.height}) not equal to (${other.width}:${other.height})`,
      );
    }

    for (let i = 0; i < this.world.length; i++) {
      if (other.world[i] !== 0) {
        this.world[i] = other.world[i];
      }
    }
  }

  public despeckle(terrain: TerrainDef): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.getLoc(x, y) === NETHER) {
          if (this.neighbors(x, y).filter((n) => n === terrain).length >= 6) {
            this.setLoc(x, y, terrain);
          }
        }
      }
    }
  }
}

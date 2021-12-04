import { rem } from "../../util.ts";
import { xPos } from "../ansiesc/control.ts";
import { HOME } from "../ansiesc/sgr.ts";
import { TextBuffer } from "../text-buffer.ts";
import { Sprite } from "./sprite.ts";
import { SQUOTS } from "./lookup/squots.ts";
import {
  isDivisibleBy3,
  isEven,
  makeDivisibleBy3,
  makeEven,
  uint8Array,
} from "./util.ts";
import { FG_COLOR } from "./lookup/colors.ts";

const bitvals = [1, 2, 4, 8, 16, 32];

class Printer {
  fg: number | null = null;
  bg: number | null = null;

  constructor(public buffer: TextBuffer) {
  }

  print(fg: number, bg: number, squotIndex: number): void {
    if (fg !== this.fg) {
      this.buffer.writeBytes(FG_COLOR[fg]);
      this.fg = fg;
    }

    if (bg !== this.bg) {
      this.buffer.writeBytes(FG_COLOR[bg]);
      this.bg = bg;
    }

    this.buffer.writeBytes(SQUOTS[squotIndex]);
  }
}

/**
 * This is a canvas.
 */
export class Canvas {
  protected constructor(
    public readonly width: number,
    public readonly height: number,
    protected readonly canvas: Uint8Array,
    protected readonly fg: Uint8Array,
    protected readonly bg: Uint8Array,
  ) {
  }

  static init(width: number, height: number, fg = 7, bg = 0): Canvas {
    if (!isEven(width)) {
      throw new Error(`width must be an even number: ${width}`);
    }
    if (!isDivisibleBy3(height)) {
      throw new Error(`height must be an even number: ${height}`);
    }

    const arraySize = width * height / 6;
    return new Canvas(
      width,
      height,
      new Uint8Array(arraySize),
      uint8Array(arraySize, fg),
      uint8Array(arraySize, bg),
    );
  }

  static from(def: string[], fg: number): Canvas {
    const width = makeEven(
      def.map((d) => d.length).reduce((a, b) => Math.max(a, b)),
    );
    const height = makeDivisibleBy3(def.length);

    const canvas = Canvas.init(width, height);

    for (let y = 0; y < def.length; y++) {
      const dstr = def[y];

      let x = 0;
      for (const d of dstr) {
        if (d !== ".") {
          canvas.setPixel(x, y, fg);
        }
        x += 1;
      }
    }

    return canvas;
  }

  clone(): Canvas {
    return new Canvas(
      this.width,
      this.height,
      this.canvas.slice(0),
      this.fg.slice(0),
      this.bg.slice(0),
    );
  }

  *rows(): IterableIterator<
    { squots: Uint8Array; fgs: Uint8Array; bgs: Uint8Array }
  > {
    let current = 0;
    const halfWid = this.width / 2;
    while (current < this.canvas.length) {
      yield {
        squots: this.canvas.slice(current, current + halfWid),
        fgs: this.fg.slice(current, current + halfWid),
        bgs: this.bg.slice(current, current + halfWid),
      };
      current += halfWid;
    }
  }

  /**
   * Write the pixels of the sprite.
   * @param x Upper left X. May go out of bounds.
   * @param y Upper left Y. May go out of bounds.
   * @param sprite The sprite to write.
   */
  writeSprite(x: number, y: number, sprite: Sprite): void {
    const spriteImage = sprite.renders[rem(x, 2) + 2 * rem(y, 3)];

    let ny = 3 * Math.floor(y / 3);
    for (const { squots, fgs } of spriteImage.rows()) {
      if (ny >= 0 && ny < this.height) {
        let nx = 2 * Math.floor(x / 2);
        let addr = this.pixelAddr(nx, ny);

        for (let i = 0; i < squots.length; i++) {
          if (nx >= 0 && nx < this.width) {
            this.canvas[addr] |= squots[i];
            this.fg[addr] = fgs[i];
          }
          nx += 2;
          addr += 1;
        }
      }
      ny += 3;
    }
  }

  /**
   * Clear the pixels of the sprite.
   * @param x Upper left X. May go out of bounds.
   * @param y Upper left Y. May go out of bounds.
   * @param sprite The sprite to clear.
   */
  clearSprite(x: number, y: number, sprite: Sprite): void {
    const spriteImage = sprite.renders[rem(x, 2) + 3 * rem(y, 3)];

    let ny = 3 * Math.floor(y / 3);
    for (const { squots } of spriteImage.rows()) {
      if (ny >= 0 && ny < this.height) {
        let nx = 2 * Math.floor(x / 2);
        let addr = this.pixelAddr(nx, ny);

        for (let i = 0; i < squots.length; i++) {
          if (nx >= 0 && nx < this.width) {
            this.canvas[addr] &= 0xF & ~squots[i];
          }
          nx += 2;
          addr += 1;
        }
      }
      ny += 3;
    }
  }

  protected pixelAddr(x: number, y: number): number {
    const xpix = Math.floor(x / 2);
    const ypix = Math.floor(y / 3);

    return ypix * (this.width / 2) + xpix;
  }

  protected pixelLoc(x: number, y: number): { addr: number; bit: number } {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new RangeError(`pixel range error: (${x}:${y})`);
    }

    const xsub = x % 2;
    const ysub = y % 3;

    return {
      addr: this.pixelAddr(x, y),
      bit: bitvals[xsub + ysub * 2],
    };
  }

  setPixel(x: number, y: number, fg: number): void {
    const { addr, bit } = this.pixelLoc(x, y);
    this.canvas[addr] |= bit;
    this.fg[addr] = fg;
  }

  clearPixel(x: number, y: number): void {
    const { addr, bit } = this.pixelLoc(x, y);
    this.canvas[addr] &= 0x0F & ~bit;
  }

  getPixel(x: number, y: number): number {
    const { addr, bit } = this.pixelLoc(x, y);
    return (this.canvas[addr] & bit) === 0 ? 0 : 1;
  }

  getPixelFgColor(x: number, y: number): number {
    const { addr } = this.pixelLoc(x, y);
    return this.fg[addr];
  }

  getPixelBgColor(x: number, y: number): number {
    const { addr } = this.pixelLoc(x, y);
    return this.bg[addr];
  }

  async print(): Promise<void> {
    const buff = new TextBuffer(Deno.stdout);

    let addr = 0;
    for (let y = 0; y < this.height / 3; y++) {
      if (addr !== 0) {
        buff.writeln();
      }

      const printer = new Printer(buff);
      for (let x = 0; x < this.width / 2; x++) {
        printer.print(this.fg[addr], this.bg[addr], this.canvas[addr]);
        addr += 1;
      }
    }

    await buff.flush();
  }

  async printDiff(other: Canvas): Promise<void> {
    if (this.height !== other.height || this.width !== other.width) {
      throw new Error(
        `dimensions must match: (${this.width},${this.height}) != (${other.width},${other.height})`,
      );
    }

    const halfWid = this.width / 2;

    const buff = new TextBuffer(Deno.stdout);
    buff.write(HOME);

    for (let y = 0; y < this.height / 3; y++) {
      if (y > 0) {
        buff.writeln();
      }

      let addr = y * halfWid;

      let printer: Printer | null = null;
      for (let x = 0; x < this.width / 2; x++) {
        if (
          this.canvas[addr] === other.canvas[addr] &&
          this.bg[addr] === other.bg[addr] &&
          this.fg[addr] === other.fg[addr]
        ) {
          printer = null;
        } else {
          if (printer === null) {
            printer = new Printer(buff);
            buff.write(xPos(x + 1));
          }

          printer.print(this.fg[addr], this.bg[addr], this.canvas[addr]);
        }
        addr += 1;
      }
    }

    await buff.flush();
  }
}

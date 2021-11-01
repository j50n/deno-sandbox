import { rem } from "../../util.ts";
import { TextBuffer } from "../text-buffer.ts";
import { Sprite } from "./sprite.ts";
import { isEven, makeEven } from "./util.ts";

const bitvals = [1, 2, 4, 8];
const pixelChars = [
  " ",
  "▘",
  "▝",
  "▀",
  "▖",
  "▌",
  "▞",
  "▛",
  "▗",
  "▚",
  "▐",
  "▜",
  "▄",
  "▙",
  "▟",
  "█",
].map((c) => new TextEncoder().encode(c));

export class Canvas {
  protected constructor(
    public readonly width: number,
    public readonly height: number,
    protected readonly canvas: Uint8Array,
  ) {
  }

  static init(width: number, height: number): Canvas {
    if (!isEven(width)) {
      throw new Error(`width must be an even number: ${width}`);
    }
    if (!isEven(height)) {
      throw new Error(`height must be an even number: ${height}`);
    }
    return new Canvas(width, height, new Uint8Array(width * height / 4));
  }

  static from(def: string[]): Canvas {
    const width = makeEven(
      def.map((d) => d.length).reduce((a, b) => Math.max(a, b)),
    );
    const height = makeEven(def.length);

    const canvas = Canvas.init(width, height);

    for (let y = 0; y < def.length; y++) {
      const dstr = def[y];

      let x = 0;
      for (const d of dstr) {
        if (d !== ".") {
          canvas.setPixel(x, y);
        }
        x += 1;
      }
    }

    return canvas;
  }

  clone(): Canvas {
    return new Canvas(this.width, this.height, this.canvas.slice(0));
  }

  *nibbleRows(): IterableIterator<Uint8Array> {
    let current = 0;
    const halfWid = this.width / 2;
    while (current < this.canvas.length) {
      yield this.canvas.slice(current, current + halfWid);
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
    const spriteImage = sprite.renders[rem(x, 2) + 2 * rem(y, 2)];

    let ny = 2 * Math.floor(y / 2);
    for (const nibbleRow of spriteImage.nibbleRows()) {
      if (ny >= 0 && ny < this.height) {
        let nx = 2 * Math.floor(x / 2);
        let addr = this.pixelAddr(nx, ny);

        for (const nibble of nibbleRow) {
          if (nx >= 0 && nx < this.width) {
            this.canvas[addr] |= nibble;
          }
          nx += 2;
          addr += 1;
        }
      }
      ny += 2;
    }
  }

  /**
   * Clear the pixels of the sprite.
   * @param x Upper left X. May go out of bounds.
   * @param y Upper left Y. May go out of bounds.
   * @param sprite The sprite to clear.
   */
  clearSprite(x: number, y: number, sprite: Sprite): void {
    const spriteImage = sprite.renders[rem(x, 2) + 2 * rem(y, 2)];

    let ny = 2 * Math.floor(y / 2);
    for (const nibbleRow of spriteImage.nibbleRows()) {
      if (ny >= 0 && ny < this.height) {
        let nx = 2 * Math.floor(x / 2);
        let addr = this.pixelAddr(nx, ny);

        for (const nibble of nibbleRow) {
          if (nx >= 0 && nx < this.width) {
            this.canvas[addr] &= 0xF & ~nibble;
          }
          nx += 2;
          addr += 1;
        }
      }
      ny += 2;
    }
  }

  protected pixelAddr(x: number, y: number): number {
    const xpix = Math.floor(x / 2);
    const ypix = Math.floor(y / 2);

    return ypix * (this.width / 2) + xpix;
  }

  protected pixelLoc(x: number, y: number): { addr: number; bit: number } {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new RangeError(`pixel range error: (${x}:${y})`);
    }

    const xsub = x % 2;
    const ysub = y % 2;

    return {
      addr: this.pixelAddr(x, y),
      bit: bitvals[xsub + ysub * 2],
    };
  }

  setPixel(x: number, y: number): void {
    const { addr, bit } = this.pixelLoc(x, y);
    this.canvas[addr] |= bit;
  }

  clearPixel(x: number, y: number): void {
    const { addr, bit } = this.pixelLoc(x, y);
    this.canvas[addr] &= 0x0F & ~bit;
  }

  getPixel(x: number, y: number): number {
    const { addr, bit } = this.pixelLoc(x, y);
    return (this.canvas[addr] & bit) === 0 ? 0 : 1;
  }

  async print(): Promise<void> {
    const buff = new TextBuffer(Deno.stdout);

    let index = 0;
    for (let y = 0; y < this.height / 2; y++) {
      if (index !== 0) {
        buff.writeln();
      }
      for (let x = 0; x < this.width / 2; x++) {
        buff.writeBytes(pixelChars[this.canvas[index]]);
        index += 1;
      }
    }

    await buff.flush();
  }
}
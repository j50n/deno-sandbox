import { rem } from "../../util.ts";
import { xPos } from "../ansiesc/control.ts";
import { HOME, RESET } from "../ansiesc/sgr.ts";
import { TextBuffer } from "../text-buffer.ts";
import { Sprite } from "./sprite.ts";
import { SQUOTS } from "./lookup/squots.ts";
import { makeDivisibleBy3, makeEven, uint8Array } from "./util.ts";
import { BG_COLOR, FG_COLOR } from "./lookup/colors.ts";
import { ESC } from "../ansiesc/common.ts";

const bitvals = [1, 2, 4, 8, 16, 32];

type PrintCallbackFn = (buff: TextBuffer) => void;

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
      this.buffer.writeBytes(BG_COLOR[bg]);
      this.bg = bg;
    }

    this.buffer.writeBytes(SQUOTS[squotIndex]);
  }
}

/**
 * A canvas supporting pixel mapping of a terminal using {@link SQUOTS} (6 pixels per character), and
 * {@link FG_COLOR}/{@link BG_COLOR} (terminal ANSI 8-bit color).
 */
export class Canvas {
  /**
   * Constructor.
   * @param widthInChars Width in characters.
   * @param heightInChars Height in characters.
   * @param widthInPixels Width in pixels (2 times {@link widthInChars}).
   * @param heightInPixels Height in pixels (3 times {@link heightInChars}).
   * @param bitmap The bitmap.
   * @param fg The foreground colors.
   * @param bg The background colors.
   */
  protected constructor(
    public readonly widthInChars: number,
    public readonly heightInChars: number,
    public readonly widthInPixels: number,
    public readonly heightInPixels: number,
    protected readonly bitmap: Uint8Array,
    protected readonly fg: Uint8Array,
    protected readonly bg: Uint8Array,
  ) {
  }

  /**
   * Initialize a canvas dimensioned relative to characters.
   *
   * @param widthInChars The width of the canvas in characters (2 pixels per character in the X direction).
   * @param heightInChars The height of the canvas in characters (3 pixels per character in the Y direction).
   * @param fg Foreground color. Index for {@link FG_COLOR}.
   * @param bg Background color. Index for {@link BG_COLOR}.
   * @returns A new blank canvas with the specified size and initialized to the given colors.
   */
  static initToCharDimensions(
    widthInChars: number,
    heightInChars: number,
    fg = 7,
    bg = 0,
  ): Canvas {
    if (!Number.isInteger(widthInChars) || widthInChars < 1) {
      throw new Error("canvas widthInChars must be a positive integer");
    }

    if (!Number.isInteger(heightInChars) || heightInChars < 1) {
      throw new Error("canvas heightInChars must be a positive integer");
    }

    const arraySize = widthInChars * heightInChars;
    const widthInPixels = widthInChars * 2;
    const heightInPixels = heightInChars * 3;

    return new Canvas(
      widthInChars,
      heightInChars,
      widthInPixels,
      heightInPixels,
      new Uint8Array(arraySize),
      uint8Array(arraySize, fg),
      uint8Array(arraySize, bg),
    );
  }

  /**
   * Initialize a canvas dimensioned relative to pixels. Width and height will be automatically increased, if needed, to
   * the next whole character.
   *
   * @param widthInPixels The width of the canvas in pixels (2 pixels per character in the X direction).
   * @param heightInPixels The height of the canvas in pixels (3 pixels per character in the Y direction).
   * @param fg Foreground color. Index for {@link FG_COLOR}.
   * @param bg Background color. Index for {@link BG_COLOR}.
   * @returns A new blank canvas with the specified size and initialized to the given colors.
   */
  static initToPixelDimensions(
    widthInPixels: number,
    heightInPixels: number,
    fg = 7,
    bg = 0,
  ): Canvas {
    return this.initToCharDimensions(
      makeEven(widthInPixels) / 2,
      makeDivisibleBy3(heightInPixels) / 3,
      fg,
      bg,
    );
  }

  /**
   * Clone (deep copy) the canvas.
   * @returns A deep copy of the canvas.
   */
  clone(): Canvas {
    return new Canvas(
      this.widthInChars,
      this.heightInChars,
      this.widthInPixels,
      this.heightInPixels,
      this.bitmap.slice(0),
      this.fg.slice(0),
      this.bg.slice(0),
    );
  }

  /**
   * Get the rows of this canvas.
   */
  *rows(): IterableIterator<
    { squots: Uint8Array; fgs: Uint8Array; bgs: Uint8Array }
  > {
    let current = 0;

    while (current < this.bitmap.length) {
      yield {
        squots: this.bitmap.slice(current, current + this.widthInChars),
        fgs: this.fg.slice(current, current + this.widthInChars),
        bgs: this.bg.slice(current, current + this.widthInChars),
      };
      current += this.widthInChars;
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
      if (ny >= 0 && ny < this.heightInPixels) {
        let nx = 2 * Math.floor(x / 2);
        let addr = this.pixelAddr(nx, ny);

        for (let i = 0; i < squots.length; i++) {
          if (nx >= 0 && nx < this.widthInPixels) {
            this.bitmap[addr] |= squots[i];
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
   * Clear the pixels of the sprite. Unconditionally blanks all the pixels that are set in the sprite image.
   * This does not change colors.
   *
   * @param x Upper left X. May go out of bounds.
   * @param y Upper left Y. May go out of bounds.
   * @param sprite The sprite to clear.
   */
  clearSprite(x: number, y: number, sprite: Sprite): void {
    const spriteImage = sprite.renders[rem(x, 2) + 3 * rem(y, 3)];

    let ny = 3 * Math.floor(y / 3);
    for (const { squots } of spriteImage.rows()) {
      if (ny >= 0 && ny < this.heightInPixels) {
        let nx = 2 * Math.floor(x / 2);
        let addr = this.pixelAddr(nx, ny);

        for (let i = 0; i < squots.length; i++) {
          if (nx >= 0 && nx < this.widthInPixels) {
            this.bitmap[addr] &= 0xF & ~squots[i];
          }
          nx += 2;
          addr += 1;
        }
      }
      ny += 3;
    }
  }

  /**
   * The character address of a pixel.
   *
   * @param x The pixel X location.
   * @param y The pixel Y location.
   * @returns The character address.
   */
  protected pixelAddr(x: number, y: number): number {
    const xpix = Math.floor(x / 2);
    const ypix = Math.floor(y / 3);

    return ypix * (this.widthInPixels / 2) + xpix;
  }

  /**
   * The character address plus the bit location of a pixel.
   *
   * @param x The pixel X location.
   * @param y The pixel Y location.
   * @returns The character address.
   */
  protected pixelLoc(x: number, y: number): { addr: number; bit: number } {
    if (x < 0 || x >= this.widthInPixels || y < 0 || y >= this.heightInPixels) {
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
    this.bitmap[addr] |= bit;
    this.fg[addr] = fg;
  }

  clearPixel(x: number, y: number): void {
    const { addr, bit } = this.pixelLoc(x, y);
    this.bitmap[addr] &= 0x0F & ~bit;
  }

  getPixel(x: number, y: number): number {
    const { addr, bit } = this.pixelLoc(x, y);
    return (this.bitmap[addr] & bit) === 0 ? 0 : 1;
  }

  getPixelFgColor(x: number, y: number): number {
    const { addr } = this.pixelLoc(x, y);
    return this.fg[addr];
  }

  getPixelBgColor(x: number, y: number): number {
    const { addr } = this.pixelLoc(x, y);
    return this.bg[addr];
  }

  /**
   * Write the canvas to console.
   *
   * This writes all squot values and colors, replacing everything. In most cases, {@link printDiff()}
   * is better for animation.
   */
  async print(): Promise<void> {
    const buff = new TextBuffer(Deno.stdout);

    buff.write(HOME);

    let addr = 0;
    for (let y = 0; y < this.heightInChars; y++) {
      if (addr !== 0) {
        buff.writeln();
      }

      const printer = new Printer(buff);
      for (let x = 0; x < this.widthInChars; x++) {
        printer.print(this.fg[addr], this.bg[addr], this.bitmap[addr]);
        addr += 1;
      }
    }

    await buff.flush();
  }

  /**
   * Calculate the difference between this canvas (the "new" canvas) and the old (previous) canvas
   * and write it to console.
   *
   * The differencing operation is very fast, and usually many times faster than {@link print()}.
   *
   * @param oldCanvas The old (previous) canvas.
   * @param onAfterDraw Callback to let you write text to the console. You are responsible for
   *                    background color of the written text. The diff will not take writes done
   *                    by the callback function into account.
   */
  async printDiff(
    oldCanvas: Canvas,
    onAfterDraw?: PrintCallbackFn,
  ): Promise<void> {
    if (
      this.heightInPixels !== oldCanvas.heightInPixels ||
      this.widthInPixels !== oldCanvas.widthInPixels
    ) {
      throw new Error(
        `pixel dimensions must match: (${this.widthInPixels},${this.heightInPixels}) != (${oldCanvas.widthInPixels},${oldCanvas.heightInPixels})`,
      );
    }

    const buff = new TextBuffer(Deno.stdout);
    buff.write(HOME);

    for (let y = 0; y < this.heightInChars; y++) {
      if (y > 0) {
        buff.writeln();
      }

      let addr = y * this.widthInChars;

      let printer: Printer | null = null;
      for (let x = 0; x < this.widthInChars; x++) {
        const bits = this.bitmap[addr];
        const oldBits = oldCanvas.bitmap[addr];

        if (
          ((bits === 0 && oldBits === 0) ||
            (bits === oldBits && this.fg[addr] === oldCanvas.fg[addr])) &&
          this.bg[addr] === oldCanvas.bg[addr]
        ) {
          printer = null;
        } else {
          if (printer === null) {
            printer = new Printer(buff);
            buff.write(xPos(x + 1));
          }

          printer.print(this.fg[addr], this.bg[addr], bits);
        }
        addr += 1;
      }
    }

    if (onAfterDraw !== undefined) {
      buff.write(HOME);
      buff.write(`${ESC}37m`);
      onAfterDraw(buff);
    }

    buff.write(RESET);

    await buff.flush();
  }
}

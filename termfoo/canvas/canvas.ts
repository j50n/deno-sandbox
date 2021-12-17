import { rem } from "../../util.ts";
import { xPos } from "../ansiesc/control.ts";
import { HOME, RESET } from "../ansiesc/sgr.ts";
import { TextBuffer } from "../text-buffer.ts";
import { Sprite } from "./sprite.ts";
import { SQUOTS } from "./lookup/squots.ts";
import { concatUint8Arrays, makeDivisibleBy3, makeEven } from "./util.ts";
import { BG_COLOR, FG_COLOR } from "./lookup/colors.ts";
import { BLACK, WHITE } from "./color.ts";
import { ESC } from "../ansiesc/common.ts";
import { Image } from "../image/image.ts";
import { SquotImage } from "../squots/squot-image.ts";

type PrintCallbackFn = (buff: TextBuffer) => void;

const ANSI_24BIT_COLOR_FG_PREFIX = new TextEncoder().encode(`${ESC}38;2;`);
const ANSI_24BIT_COLOR_BG_PREFIX = new TextEncoder().encode(`${ESC}48;2;`);
const ANSI_SEP = new TextEncoder().encode(";");
const ANSI_SUFFIX = new TextEncoder().encode("m");

const ANSI_BYTE: Uint8Array[] = (() => {
  const result = [];
  for (let i = 0; i < 256; i++) {
    result.push(new TextEncoder().encode(`${i}`));
  }
  return result;
})();

class Printer {
  fg: number | null = null;
  bg: number | null = null;

  constructor(public buffer: TextBuffer) {
  }

  print(fg: number, bg: number, squotIndex: number): void {
    if (fg !== this.fg) {
      this.buffer.writeBytes(printFgColor(fg));
      this.fg = fg;
    }

    if (bg !== this.bg) {
      this.buffer.writeBytes(printBgColor(bg));
      this.bg = bg;
    }

    this.buffer.writeBytes(SQUOTS[squotIndex]);
  }
}

function printFgColor(color: number): Uint8Array {
  if (!Number.isInteger(color)) {
    throw new Error("color must be an integer");
  }

  const hiByte = (color >> 24) & 0xFF;
  if (hiByte === 0) {
    const color8Index = color;
    return FG_COLOR[color8Index];
  } else if (hiByte === 0xFF) {
    const r = (color >> 16) & 0xFF;
    const g = (color >> 8) & 0xFF;
    const b = color & 0xFF;

    return concatUint8Arrays(
      ANSI_24BIT_COLOR_FG_PREFIX,
      ANSI_BYTE[r],
      ANSI_SEP,
      ANSI_BYTE[g],
      ANSI_SEP,
      ANSI_BYTE[b],
      ANSI_SUFFIX,
    );
  } else {
    throw new Error(`illegal color value (hiByte=${hiByte})`);
  }
}

function printBgColor(color: number): Uint8Array {
  if (!Number.isInteger(color)) {
    throw new Error("color must be an integer");
  }

  const hiByte = (color >> 24) & 0xFF;
  if (hiByte === 0) {
    const color8Index = color;
    return BG_COLOR[color8Index];
  } else if (hiByte === 0xFF) {
    const r = (color >> 16) & 0xFF;
    const g = (color >> 8) & 0xFF;
    const b = color & 0xFF;

    return concatUint8Arrays(
      ANSI_24BIT_COLOR_BG_PREFIX,
      ANSI_BYTE[r],
      ANSI_SEP,
      ANSI_BYTE[g],
      ANSI_SEP,
      ANSI_BYTE[b],
      ANSI_SUFFIX,
    );
  } else {
    throw new Error("illegal color value");
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
   * @param fg The squot image.
   * @param bg The background colors.
   */
  protected constructor(
    public readonly widthInChars: number,
    public readonly heightInChars: number,
    public readonly widthInPixels: number,
    public readonly heightInPixels: number,
    public readonly fg: SquotImage,
    public readonly bg: Image,
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

    const widthInPixels = widthInChars * 2;
    const heightInPixels = heightInChars * 3;

    return new Canvas(
      widthInChars,
      heightInChars,
      widthInPixels,
      heightInPixels,
      SquotImage.init(widthInChars, heightInChars, fg),
      Image.init(widthInChars, heightInChars, bg),
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
      this.fg.clone(),
      this.bg.clone(),
    );
  }

  /**
   * Get the rows of this canvas.
   */
  *rows(): IterableIterator<
    { squots: Uint8Array; fgs: Uint32Array; bgs: Uint32Array }
  > {
    let current = 0;

    while (current < this.fg.pixels.length) {
      yield {
        squots: this.fg.pixels.slice(current, current + this.widthInChars),
        fgs: this.fg.colors.slice(current, current + this.widthInChars),
        bgs: this.bg.image.slice(current, current + this.widthInChars),
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
        const loc = this.fg.location(nx, ny);
        if (loc !== null) {
          let addr = loc.addr;
          for (let i = 0; i < squots.length; i++) {
            if (nx >= 0 && nx < this.widthInPixels) {
              this.fg.pixels[addr] |= squots[i];
              this.fg.colors[addr] = fgs[i];
            }
            nx += 2;
            addr += 1;
          }
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
        const loc = this.fg.location(nx, ny); //this.pixelAddr(nx, ny);
        if (loc !== null) {
          let addr = loc.addr;
          for (let i = 0; i < squots.length; i++) {
            if (nx >= 0 && nx < this.widthInPixels) {
              this.fg.pixels[addr] &= 0xF & ~squots[i];
            }
            nx += 2;
            addr += 1;
          }
        }
      }
      ny += 3;
    }
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
        printer.print(
          this.fg.colors[addr],
          this.bg.image[addr],
          this.fg.pixels[addr],
        );
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
        const bits = this.fg.pixels[addr];
        const oldBits = oldCanvas.fg.pixels[addr];

        if (
          ((bits === 0 && oldBits === 0) ||
            (bits === oldBits &&
              this.fg.colors[addr] === oldCanvas.fg.colors[addr])) &&
          this.bg.image[addr] === oldCanvas.bg.image[addr]
        ) {
          printer = null;
        } else {
          if (printer === null) {
            printer = new Printer(buff);
            buff.write(xPos(x + 1));
          }

          printer.print(this.fg.colors[addr], this.bg.image[addr], bits);
        }
        addr += 1;
      }
    }

    if (onAfterDraw !== undefined) {
      buff.write(HOME);
      buff.writeBytes(FG_COLOR[WHITE]);
      buff.writeBytes(BG_COLOR[BLACK]);
      onAfterDraw(buff);
    }

    buff.write(RESET);

    await buff.flush();
  }
}

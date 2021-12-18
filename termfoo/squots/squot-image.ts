import { Color, PixelReader, PixelWriter } from "../image/pixels.ts";
import { CLEAR } from "../canvas/color.ts";

const bits = [1, 2, 4, 8, 16, 32];

/**
 * An image that contains 6 pixels per character. All 6 pixels in each character are the same color.
 *
 * This uses the color convention of a `Canvas`. 24 bit colors have `alpha` of 255, and the
 * lower 256 colors are for 3/4/8 bit colors. {@link CLEAR} is used to indicate that no bit
 * is set.
 */
export class SquotImage implements PixelReader, PixelWriter {
  width: number;
  height: number;

  protected constructor(
    public readonly widthInChars: number,
    public readonly heightInChars: number,
    public readonly pixels: Uint8Array,
    public readonly colors: Uint32Array,
  ) {
    if (!Number.isInteger(widthInChars) || widthInChars < 1) {
      throw new Error("widthInChars must be a positive integer");
    }

    if (!Number.isInteger(heightInChars) || heightInChars < 1) {
      throw new Error("heightInChars must be a positive integer");
    }

    this.width = widthInChars * 2;
    this.height = heightInChars * 3;
  }

  static init(
    widthInChars: number,
    heightInChars: number,
  ): SquotImage {
    const totalSizeInChars = widthInChars * heightInChars;

    return new SquotImage(
      widthInChars,
      heightInChars,
      new Uint8Array(totalSizeInChars),
      new Uint32Array(totalSizeInChars),
    );
  }

  /**
   * Get the color of a pixel.
   *
   * If the pixel is clear (not set), the value returned is the special color {@link CLEAR}.
   *
   * @param x The X coordinate.
   * @param y The Y coordinate.
   * @returns The color of the pixel at the coordinate, or {@link CLEAR} if the pixel is clear.
   */
  getPixel(x: number, y: number): Color {
    const loc = this.location(x, y);
    if (loc === null) {
      return CLEAR;
    } else {
      if ((this.pixels[loc.addr] & loc.bit) === 0) {
        return CLEAR;
      } else {
        return this.colors[loc.addr];
      }
    }
  }

  /**
   * Set or clear a pixel.
   *
   * Pixel color is applied to the foreground of all 6 pixels of the squot.
   *
   * Set the color to special color {@link CLEAR} to clear the pixel.
   *
   * @param x The X coordinate.
   * @param y The Y coordinate.
   * @param color Pixel color.
   */
  setPixel(x: number, y: number, color: Color): void {
    const loc = this.location(x, y);
    if (loc !== null) {
      if (color === CLEAR) {
        this.pixels[loc.addr] &= ~loc.bit & 0x3F;
      } else {
        this.pixels[loc.addr] |= loc.bit;
        this.colors[loc.addr] = color;
      }
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

    return ypix * this.widthInChars + xpix;
  }

  /**
   * The character address plus the bit location of a pixel, or `null` if the point is not
   * in the image.
   *
   * @param x The pixel X location.
   * @param y The pixel Y location.
   * @returns The character address and bit, or null if the point is outside the image area.
   */
  public location(
    x: number,
    y: number,
  ): { addr: number; bit: number } | null {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new Error("x,y values must be integers");
    }

    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }

    const xsub = x % 2;
    const ysub = y % 3;

    return {
      addr: this.pixelAddr(x, y),
      bit: bits[xsub + ysub * 2],
    };
  }

  public clone(): SquotImage {
    return new SquotImage(
      this.widthInChars,
      this.heightInChars,
      this.pixels.slice(0),
      this.colors.slice(0),
    );
  }

  /**
   * Get the rows of this image.
   */
  *rows(): IterableIterator<
    { squots: Uint8Array; fgs: Uint32Array }
  > {
    let current = 0;

    while (current < this.pixels.length) {
      yield {
        squots: this.pixels.slice(current, current + this.widthInChars),
        fgs: this.colors.slice(current, current + this.widthInChars),
      };
      current += this.widthInChars;
    }
  }

  /**
   * Get the rows of this image, but just the squots, ignoring the colors.
   */
  *squotRows(): IterableIterator<
    Uint8Array
  > {
    let current = 0;

    while (current < this.pixels.length) {
      yield this.pixels.slice(current, current + this.widthInChars);
      current += this.widthInChars;
    }
  }
}

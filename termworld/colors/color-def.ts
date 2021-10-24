import { bg, fg, Pixel } from "../../termfoo/mod.ts";

/**
 * A color definition.
 *
 * This is set up to pre-encode the bytes needed as well as being comparable by object reference.
 */
export class ColorDef {
  /** Set foreground to a 24-bit color. */
  readonly fg: Uint8Array;
  /** Set background to a 24-bit color. */
  readonly bg: Uint8Array;

  /**
   * Constructor.
   * @param color The color.
   * @param name A descriptive name for the color.
   */
  constructor(public readonly color: Pixel, public readonly name: string) {
    this.bg = new TextEncoder().encode(bg(color));
    this.fg = new TextEncoder().encode(fg(color));
  }

  toString(): string {
    return `color(${this.name},${this.color.r}:${this.color.g}:${this.color.b})`;
  }
}

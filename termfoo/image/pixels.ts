/**
 * Unsigned 32 bit integer with bytes arranged high to low as transparency, red, green, and blue.
 *
 * Note that transparency may or may not be supported, depending on context.
 */
export type Color = number;

/**
 * Color component; 0 to 255.
 */
export type ColorComp = number;

/**
 * Create a color value from components.
 * @param a Alpha (transparency).
 * @param r Red.
 * @param g Green.
 * @param b Blue.
 * @returns A 24/32 bit color.
 */
export function color(
  a: ColorComp,
  r: ColorComp,
  g: ColorComp,
  b: ColorComp,
): Color {
  return ((a & 0xFF) << 24) |
    ((r & 0xFF) << 16) |
    ((g & 0xFF) << 8) |
    (b & 0xFF);
}

/**
 * Alpha, or transparency value. This may or may not be supported in any particular context.
 */
export function alpha(color: Color): ColorComp {
  return (color & 0xFF000000) >> 24;
}

/** Red color component. */
export function red(color: Color): ColorComp {
  return (color & 0x00FF0000) >> 16;
}

/** Green color component. */
export function green(color: Color): ColorComp {
  return (color & 0x0000FF00) >> 8;
}

/** Blue color component. */
export function blue(color: Color): ColorComp {
  return color & 0x000000FF;
}

export type PixelReader = {
  readonly width: number;
  readonly height: number;
  readonly getPixel: (x: number, y: number) => Color;
};

export type PixelWriter = {
  readonly width: number;
  readonly height: number;
  readonly setPixel: (x: number, y: number, color: Color) => void;
};

export type Point = { x: number; y: number };

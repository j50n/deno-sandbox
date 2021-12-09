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

export function color(
  t: ColorComp,
  r: ColorComp,
  g: ColorComp,
  b: ColorComp,
): Color {
  return ((t & 0xFF) << 24) |
    ((r & 0xFF) << 16) |
    ((g & 0xFF) << 16) |
    (b & 0xFF);
}

export function transparency(color: Color): ColorComp {
  return (color & 0xFF000000) >> 24;
}

export function red(color: Color): ColorComp {
  return (color & 0x00FF0000) >> 16;
}

export function green(color: Color): ColorComp {
  return (color & 0x0000FF00) >> 8;
}

export function blue(color: Color): ColorComp {
  return color & 0x000000FF;
}

export interface PixelReader {
  width: number;
  height: number;
  getPixel: (x: number, y: number) => Color;
}

export interface PixelWriter {
  width: number;
  height: number;
  setPixel: (x: number, y: number, color: Color) => void;
}

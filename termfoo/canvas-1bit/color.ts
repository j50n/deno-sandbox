/**
 * Grey-scale colors in 24 shades.
 * @param brightness Shades of grey from 0 to 23.
 * @returns The 8-bit color index.
 */
export function greyscale(brightness: number): number {
  if (brightness < 0 || brightness > 23) {
    throw new Error("greyscale brightness must be between 0 and 23");
  }

  return 232 + brightness;
}

export const BLACK = 0;
export const RED = 1;
export const GREEN = 2;
export const YELLOW = 3;
export const BLUE = 4;
export const MAGENTA = 5;
export const CYAN = 6;
export const WHITE = 7;

export const BRIGHT = 8;

/**
 * 6x6x6 color cube.
 * @param r Red component; 0 to 5.
 * @param g Green component; 0 to 5.
 * @param b Blue component; 0 to 5.
 * @returns The 8-bit color index.
 */
export function color8(r: number, g: number, b: number): number {
  if (r < 0 || r > 5) {
    throw new Error("color8 r (red) must be between 0 and 5");
  }

  if (g < 0 || g > 5) {
    throw new Error("color8 g (green) must be between 0 and 5");
  }

  if (b < 0 || b > 5) {
    throw new Error("color8 b (blue) must be between 0 and 5");
  }

  return 16 + 36 * r + 6 * g + b;
}

/**
 * 256x256x256 color cube.
 * @param r Red component; 0 to 255.
 * @param g Green component; 0 to 255.
 * @param b Blue component; 0 to 255.
 * @returns The 24-bit color index.
 */
export function color24(r: number, g: number, b: number): number {
  if (r < 0 || r > 255) {
    throw new Error("color24 r (red) must be between 0 and 255");
  }

  if (g < 0 || g > 255) {
    throw new Error("color24 g (green) must be between 0 and 255");
  }

  if (b < 0 || b > 255) {
    throw new Error("color24 b (blue) must be between 0 and 255");
  }

  return (1 << 24) | (r << 16) | (g << 8) | b;
}

import { ESC } from "../../ansi-esc/common.ts";

/**
 * Lookup for foreground color ANSI escape codes, 8 bit color. 0 to 255.
 */
export const FG_COLOR: readonly Uint8Array[] = (() => {
  const result: Uint8Array[] = [];

  for (let i = 0; i < 8; i++) {
    result.push(new TextEncoder().encode(`${ESC}${30 + i}m`));
  }

  for (let i = 0; i < 8; i++) {
    result.push(new TextEncoder().encode(`${ESC}${90 + i}m`));
  }

  for (let i = 16; i < 256; i++) {
    result.push(new TextEncoder().encode(`${ESC}38;5;${i}m`));
  }

  return result;
})();

/**
 * Lookup for background color ANSI escape codes, 8 bit color. 0 to 255.
 */
export const BG_COLOR: readonly Uint8Array[] = (() => {
  const result: Uint8Array[] = [];

  for (let i = 0; i < 8; i++) {
    result.push(new TextEncoder().encode(`${ESC}${40 + i}m`));
  }

  for (let i = 0; i < 8; i++) {
    result.push(new TextEncoder().encode(`${ESC}${100 + i}m`));
  }

  for (let i = 16; i < 256; i++) {
    result.push(new TextEncoder().encode(`${ESC}48;5;${i}m`));
  }
  return result;
})();

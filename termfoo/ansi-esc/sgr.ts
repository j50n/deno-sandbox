import { sh } from "../deps/asynciter.ts";
import { ESC } from "./common.ts";

/** All attributes off */
export const RESET = `${ESC}0m`;

/** Bold or increased intensity. As with faint, the color change is a PC (SCO/CGA) invention. */
export const BOLD = `${ESC}1m`;

/** Faint, decreased intensity, or dim. May be implemented as a light font weight like bold. */
export const FAINT = `${ESC}2m`;

/** Italic. Not widely supported. Sometimes treated as inverse or blink. */
export const ITALIC = `${ESC}3m`;

/** Underline. Style extensions exist for Kitty, VTE, mintty and iTerm2. */
export const UNDERLINE = `${ESC}4m`;

/** Slow blink. Less than 150 per minute. */
export const BLINK = `${ESC}5m`;

/** Rapid blink. MS-DOS ANSI.SYS, 150+ per minute; not widely supported. */
export const RAPID_BLINK = `${ESC}6m`;

/** Reverse video or invert. Swap foreground and background colors; inconsistent emulation. */
export const INVERT = `${ESC}7m`;

/** Conceal or hide. Not widely supported. */
export const CONCEAL = `${ESC}8m`;

/** Crossed-out, or strike	Characters legible but marked as if for deletion. */
export const STRIKE = `${ESC}9m`;

/** Primary (default) font. */
export const DEFAULT_FONT = `${ESC}10m`;
/**
 * Alternative font	Select alternative font 1 to 9.
 */
export function altFont(font: number): string {
  if (font < 1 || font > 9) {
    throw new Error(`font must be in 1..9 but got ${font}`);
  }
  return `${ESC}${10 + font}m`;
}

/** Fraktur (Gothic). Rarely supported. */
export const FRAKTUR = `${ESC}20m`;

/** Alternate screen buffer. */
export const SCREEN_1 = await (async () => {
  try {
    const smcup = await sh({ cmd: ["tput", "smcup"] }).collect();
    return smcup[0];
  } catch {
    return "";
  }
})();

/** Default screen buffer. */
export const SCREEN_0 = await (async () => {
  try {
    const rmcup = await sh({ cmd: ["tput", "rmcup"] }).collect();
    return rmcup[0];
  } catch {
    return "";
  }
})();

export const HOME = goto(1, 1);

/**
 * Goto the given position. Top left is 1,1.
 *
 * @param x The x coordinate.
 * @param y The y coordinate.
 */
export function goto(x: number, y: number): string {
  if (x < 1) throw new RangeError("x must be 1 or greater");
  if (y < 1) throw new RangeError("y must be 1 or greater");
  return `${ESC}${x};${y}H`;
}

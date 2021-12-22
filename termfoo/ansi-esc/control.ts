import { ESC } from "./common.ts";

/**
 * Cursor horizontal absolute (CHA). Leftmost position is 1.
 */
export function xPos(n: number): string {
  return `${ESC}${n}G`;
}

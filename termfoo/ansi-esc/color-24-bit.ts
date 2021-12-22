import { blue, Color, green, red } from "../image/pixels.ts";
import { ESC } from "./common.ts";

export function fg(color: Color): string {
  const r = red(color);
  const g = green(color);
  const b = blue(color);
  return `${ESC}38;2;${r};${g};${b}m`;
}

export function bg(color: Color): string {
  const r = red(color);
  const g = green(color);
  const b = blue(color);
  return `${ESC}48;2;${r};${g};${b}m`;
}

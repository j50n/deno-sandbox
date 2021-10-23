
import { Pixel } from "../images/pixel-source.ts";
import { ESC } from "./common.ts";

export function fg(color: Pixel): string {
    const {r,g,b} = color;
    return `${ESC}38;2;${r};${g};${b}m`;
}

export function bg(color: Pixel): string {
    const {r,g,b} = color;
    return `${ESC}48;2;${r};${g};${b}m`;
}
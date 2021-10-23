
import { ESC } from "./common.ts";

type Color8Bit = number;

export function fg(color: Color8Bit): string {
    return `${ESC}38;5;${color}m`;
}

export function bg(color: Color8Bit): string {
    return `${ESC}48;5;${color}m`;
}

export function color(r: number, g: number, b: number): Color8Bit {
    if(r < 0 || r > 5 || !Number.isInteger(r)) {
        throw new Error ("r must be an integer in range 0..5");
    }
    if(g < 0 || g > 5 || !Number.isInteger(g)) {
        throw new Error ("g must be an integer in range 0..5");
    }
    if(b < 0 || b > 5 || !Number.isInteger(b)) {
        throw new Error ("b must be an integer in range 0..5");
    }
    return  16 + 36 * r + 6 * g + b;
}
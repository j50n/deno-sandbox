import { ESC } from "../../ansiesc/common.ts";

/**
 * Lookup for foreground color ANSI escape codes, 8 bit color. 0 to 255.
 */
export const FgColors: Uint8Array[] = (() => {
    const result: Uint8Array[] = [];
    for(let i =0; i<256; i++){
        result.push(new TextEncoder().encode(`${ESC}38;5;${i}m`));
    }
    return result;
})();

/**
 * Lookup for background color ANSI escape codes, 8 bit color. 0 to 255.
 */
export const BgColors: Uint8Array[] = (() => {
    const result: Uint8Array[] = [];
    for(let i =0; i<256; i++){
        result.push(new TextEncoder().encode(`${ESC}48;5;${i}m`));
    }
    return result;
})();


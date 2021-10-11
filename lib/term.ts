import {tty} from "./deps.ts";

export enum Color {
    Black=0,
    Red=1,
    Green=2,
    Yellow=3,
    Blue=4,
    Magenta=5,
    Cyan=6,
    White=7,
}

export enum Intensity {
    Standard,
    Bright,
}

export async function reset(): Promise<void> {
    await tty.cursor(`0m`);
}

export async function colorFg(color: Color, intensity?: Intensity): Promise<void> {
    if(intensity === Intensity.Bright){
        await tty.cursor(`1;${color + 30}m`);
    } else {
        await tty.cursor(`${color + 30}m`);
    }
}

export async function colorBg(color: Color, intensity?: Intensity): Promise<void> {
    if(intensity === Intensity.Bright){
        await tty.cursor(`1;${color + 40}m`);
    } else {
        await tty.cursor(`${color + 40}m`);
    }
}

export interface RGB8 {
    r: number;
    g: number;
    b: number;
}

function checkRGB(rgb: RGB8): void {
    const {r,g,b} = rgb;

    if(r < 0 || r > 6 || !Number.isInteger(r)){
        throw new Error(`r must be integer from 0 to 5 but got ${r}`)
    }

    if(g < 0 || g > 6 || !Number.isInteger(g)){
        throw new Error(`g must be integer from 0 to 5 but got ${g}`)
    }

    if(b < 0 || b > 6 || !Number.isInteger(b)){
        throw new Error(`b must be integer from 0 to 5 but got ${b}`)
    }
}

export async function colorFg8(color: RGB8): Promise<void> {
    checkRGB(color);
    await tty.cursor(`38;5;${16 + 36 * color.r + 6 * color.g + color.b}m`);
}

export async function colorBg8(color: RGB8): Promise<void> {
    checkRGB(color);
    await tty.cursor(`48;5;${16 + 36 * color.r + 6 * color.g + color.b}m`);
}
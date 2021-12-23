import { termfoo } from "../deps.ts";

export const DOT = [
  termfoo.Sprite.init([
    "█",
    //"██",
  ]),
];

export const POWER_DOT = [
  termfoo.Sprite.init([
    ".██.",
    "████",
    "████",
    ".██.",
  ]),
];

export const WALL = [
  termfoo.Sprite.init([
    "█.█.█.█.",
    ".......█",
    "█.......",
    ".......█",
    "█.......",
    ".█.█.█.█",
  ]),
];

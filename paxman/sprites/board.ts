import { ttyfu } from "../deps.ts";

export const DOT = [
  ttyfu.Sprite.init([
    "█",
    //"██",
  ]),
];

export const POWER_DOT = [
  ttyfu.Sprite.init([
    ".██.",
    "████",
    "████",
    ".██.",
  ]),
];

export const WALL = [
  ttyfu.Sprite.init([
    "█.█.█.█.",
    ".......█",
    "█.......",
    ".......█",
    "█.......",
    ".█.█.█.█",
  ]),
];
